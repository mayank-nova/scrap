"""Scrap Setu: one FastAPI app that serves both the API (/api/...) and the frontend (/)."""
import base64
import hashlib
import hmac
import html
import json
import math
import os
import re
import secrets
import time
import urllib.parse
import urllib.request
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, Request, UploadFile
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import inspect, text, update
from sqlalchemy.orm import Session

import database
from models import schema

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "frontend"

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "").strip()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "").strip()
NOTIFY_RADIUS_KM = float(os.getenv("NOTIFY_RADIUS_KM", "10"))  # collectors this close get told about a new request
CO2_PER_KG = 2.5  # kg of CO2 saved per kg of scrap recycled (rough average, same factor the old stats route used)

app = FastAPI(title="Scrap-Setu")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

schema.Base.metadata.create_all(bind=database.engine)


def migrate():
    """create_all() never alters existing tables, so add the new columns to an older scrap.db."""
    wanted = {
        "users": [("google_sub", "VARCHAR"), ("lat", "FLOAT"), ("lng", "FLOAT")],
        "pickups": [("final_amount", "FLOAT"), ("lat", "FLOAT"), ("lng", "FLOAT"), ("rating", "INTEGER"), ("review", "VARCHAR")],
    }
    insp = inspect(database.engine)
    with database.engine.begin() as conn:
        for table, cols in wanted.items():
            have = {c["name"] for c in insp.get_columns(table)}
            for name, typ in cols:
                if name not in have:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {typ}"))
        conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_google_sub ON users(google_sub)"))


migrate()


# The frontend reads {"error": "...", } from failed responses.
@app.exception_handler(HTTPException)
async def http_error(_: Request, exc: HTTPException):
    return JSONResponse({"error": str(exc.detail)}, status_code=exc.status_code)


@app.exception_handler(RequestValidationError)
async def validation_error(_: Request, exc: RequestValidationError):
    return JSONResponse({"error": "Please check the details you entered."}, status_code=422)


# ---------------------------------------------------------------- small helpers
_hits = {}


def rate_limit(request: Request, key: str, limit: int, per: int):
    """Tiny in-memory limiter (per IP). Good enough for one server process."""
    ip = request.client.host if request.client else "?"
    now = time.time()
    bucket = [t for t in _hits.get((key, ip), []) if now - t < per]
    if len(bucket) >= limit:
        raise HTTPException(status_code=429, detail="Too many requests. Please wait a moment and try again.")
    bucket.append(now)
    _hits[(key, ip)] = bucket


def haversine_km(lat1, lng1, lat2, lng2) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def valid_coords(lat, lng) -> bool:
    return lat is not None and lng is not None and -90 <= lat <= 90 and -180 <= lng <= 180


def area_coord(v: float) -> float:
    return round(v, 2)  # two decimals is roughly 1 km: what collectors see before they accept


# ---------------------------------------------------------------- prices
# ids must match PRICE_IDS in frontend/js/session.js. low/high = what the collector pays the customer per kg,
# sellLow/sellHigh = what a recycler pays the collector. These are only the starting values: they are copied into
# the database on first run and the admin panel edits them from then on.
DEFAULT_PRICES = [
    {"id": "newspaper", "low": 12, "high": 15, "sellLow": 15, "sellHigh": 18},
    {"id": "office-paper", "low": 14, "high": 18, "sellLow": 17, "sellHigh": 21},
    {"id": "books", "low": 10, "high": 13, "sellLow": 12, "sellHigh": 15},
    {"id": "cardboard", "low": 7, "high": 10, "sellLow": 9, "sellHigh": 12},
    {"id": "pet", "low": 14, "high": 20, "sellLow": 18, "sellHigh": 24},
    {"id": "hard-plastic", "low": 10, "high": 15, "sellLow": 13, "sellHigh": 18},
    {"id": "plastic-bags", "low": 4, "high": 8, "sellLow": 6, "sellHigh": 10},
    {"id": "iron", "low": 28, "high": 34, "sellLow": 33, "sellHigh": 39},
    {"id": "steel", "low": 35, "high": 45, "sellLow": 42, "sellHigh": 52},
    {"id": "aluminium", "low": 100, "high": 125, "sellLow": 118, "sellHigh": 140},
    {"id": "brass", "low": 320, "high": 380, "sellLow": 360, "sellHigh": 420},
    {"id": "copper", "low": 520, "high": 620, "sellLow": 580, "sellHigh": 680},
    {"id": "glass", "low": 2, "high": 5, "sellLow": 4, "sellHigh": 7},
    {"id": "mobiles", "low": 40, "high": 150, "sellLow": 60, "sellHigh": 180},
    {"id": "cables", "low": 20, "high": 60, "sellLow": 28, "sellHigh": 70},
    # e-waste added later (sample numbers, the admin sets the real ones)
    {"id": "laptops", "low": 80, "high": 200, "sellLow": 100, "sellHigh": 240},
    {"id": "circuit-boards", "low": 150, "high": 400, "sellLow": 200, "sellHigh": 480},
    {"id": "batteries", "low": 60, "high": 80, "sellLow": 70, "sellHigh": 95},
    {"id": "tv-monitors", "low": 10, "high": 25, "sellLow": 14, "sellHigh": 32},
]
PRICE_IDS = [p["id"] for p in DEFAULT_PRICES]
# Which scanner material each price id belongs to (used to check the AI's answer).
PRICE_MATERIAL = {
    "newspaper": "paper", "office-paper": "paper", "books": "paper", "cardboard": "paper",
    "pet": "plastic", "hard-plastic": "plastic", "plastic-bags": "plastic",
    "iron": "metal", "steel": "metal", "aluminium": "metal", "brass": "metal", "copper": "metal", "batteries": "metal",
    "glass": "glass",
    "mobiles": "ewaste", "cables": "ewaste", "laptops": "ewaste", "circuit-boards": "ewaste", "tv-monitors": "ewaste",
}


def seed_prices(db: Session):
    have = {r.id for r in db.query(schema.PriceRow).all()}
    for p in DEFAULT_PRICES:  # also adds items introduced after the first run
        if p["id"] not in have:
            db.add(schema.PriceRow(id=p["id"], low=p["low"], high=p["high"], sell_low=p["sellLow"], sell_high=p["sellHigh"], trend=0.0))
    db.commit()


def effective(r: schema.PriceRow) -> dict:
    f = 1 + (r.trend or 0) / 100
    return {
        "id": r.id,
        "low": round(r.low * f), "high": round(r.high * f),
        "sellLow": round(r.sell_low * f), "sellHigh": round(r.sell_high * f),
        "trendPct": round(r.trend or 0, 1),
    }


def price_map(db: Session) -> dict:
    return {r.id: effective(r) for r in db.query(schema.PriceRow).all()}


@app.get("/api/prices")
def get_prices(db: Session = Depends(database.get_db)):
    m = price_map(db)
    return {"prices": [m[i] for i in PRICE_IDS if i in m]}


# ---------------------------------------------------------------- auth
def _secret() -> bytes:
    env = os.getenv("SECRET_KEY")
    if env:
        return env.encode()
    path = BASE_DIR / ".secret"
    if not path.exists():
        path.write_text(secrets.token_hex(32))
    return path.read_text().strip().encode()


SECRET = _secret()
TOKEN_TTL = 60 * 60 * 24 * 7  # 7 days


def hash_password(password: str, salt: str = None) -> str:
    salt = salt or secrets.token_hex(8)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 200_000).hex()
    return f"{salt}${digest}"


def check_password(password: str, stored: str) -> bool:
    try:
        salt, _ = stored.split("$", 1)
    except ValueError:
        return False
    return hmac.compare_digest(hash_password(password, salt), stored)


def make_token(user_id: int) -> str:
    payload = base64.urlsafe_b64encode(json.dumps({"uid": user_id, "exp": int(time.time()) + TOKEN_TTL}).encode()).decode()
    sig = hmac.new(SECRET, payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}.{sig}"


def read_token(token: str):
    try:
        payload, sig = token.split(".", 1)
        good = hmac.new(SECRET, payload.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, good):
            return None
        data = json.loads(base64.urlsafe_b64decode(payload.encode()))
        return data["uid"] if data["exp"] > time.time() else None
    except Exception:
        return None


def current_user(authorization: str = Header(None), db: Session = Depends(database.get_db)) -> schema.User:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Please log in.")
    uid = read_token(authorization[7:].strip())
    user = db.get(schema.User, uid) if uid else None
    if not user:
        raise HTTPException(status_code=401, detail="Please log in again.")
    return user


def user_json(u: schema.User):
    return {"name": u.name, "username": u.username, "role": u.role, "lat": u.lat, "lng": u.lng}


def need_role(user: schema.User, role: str, msg: str):
    if user.role != role:
        raise HTTPException(status_code=403, detail=msg)


class SignupBody(BaseModel):
    name: str
    username: str
    email: str = ""
    role: str = "customer"
    password: str


class LoginBody(BaseModel):
    username: str
    password: str


@app.post("/api/auth/signup")
def signup(body: SignupBody, request: Request, db: Session = Depends(database.get_db)):
    rate_limit(request, "signup", 20, 3600)
    username = body.username.strip().lower()
    if body.role not in ("customer", "collector"):  # admins are created from .env, never from the signup form
        raise HTTPException(status_code=400, detail="Role must be customer or collector.")
    if not body.name.strip() or len(username) < 3 or len(body.password) < 6:
        raise HTTPException(status_code=400, detail="Check your details and try again.")
    if db.query(schema.User).filter(schema.User.username == username).first():
        raise HTTPException(status_code=409, detail="That username is taken.")
    user = schema.User(
        username=username, email=body.email.strip().lower(), name=body.name.strip(),
        role=body.role, password_hash=hash_password(body.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"token": make_token(user.id), "user": user_json(user)}


@app.post("/api/auth/login")
def login(body: LoginBody, request: Request, db: Session = Depends(database.get_db)):
    rate_limit(request, "login", 30, 600)
    ident = body.username.strip().lower()
    user = (
        db.query(schema.User)
        .filter((schema.User.username == ident) | (schema.User.email == ident))
        .filter(schema.User.google_sub.is_(None) | (schema.User.username == ident))
        .first()
    )
    if not user or not check_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Wrong username or password.")
    return {"token": make_token(user.id), "user": user_json(user)}


@app.get("/api/auth/me")
def me(user: schema.User = Depends(current_user)):
    return {"user": user_json(user)}


class GoogleBody(BaseModel):
    credential: str
    role: str = "customer"


def verify_google(credential: str) -> dict:
    """Ask Google to check the sign-in token (signature and expiry), then check it was issued for this site."""
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google sign-in is not configured.")
    url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + urllib.parse.quote(credential, safe="")
    try:
        with urllib.request.urlopen(url, timeout=8) as r:
            info = json.loads(r.read())
    except Exception:
        raise HTTPException(status_code=401, detail="Google sign-in failed. Please try again.")
    if info.get("aud") != GOOGLE_CLIENT_ID or info.get("iss") not in ("accounts.google.com", "https://accounts.google.com"):
        raise HTTPException(status_code=401, detail="Google sign-in failed. Please try again.")
    if str(info.get("email_verified")).lower() != "true" or not info.get("sub"):
        raise HTTPException(status_code=401, detail="Your Google email is not verified.")
    return info


@app.post("/api/auth/google")
def google_login(body: GoogleBody, request: Request, db: Session = Depends(database.get_db)):
    rate_limit(request, "google", 30, 600)
    info = verify_google(body.credential)
    user = db.query(schema.User).filter(schema.User.google_sub == info["sub"]).first()
    if not user:
        # Only customers and collectors can join this way. Existing password accounts are never linked by email
        # (anyone can type any email into the normal signup form), so this always makes a fresh account.
        if body.role not in ("customer", "collector"):
            raise HTTPException(status_code=400, detail="Role must be customer or collector.")
        email = (info.get("email") or "").lower()
        base = re.sub(r"[^a-z0-9_]", "", email.split("@")[0].lower())[:14] or "user"
        username = base
        while db.query(schema.User).filter(schema.User.username == username).first():
            username = f"{base}{secrets.randbelow(10000)}"
        user = schema.User(
            username=username, email=email, name=(info.get("name") or base)[:80], role=body.role,
            password_hash=hash_password(secrets.token_hex(24)), google_sub=info["sub"],
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return {"token": make_token(user.id), "user": user_json(user)}


@app.get("/api/config")
def public_config():
    return {"googleClientId": GOOGLE_CLIENT_ID, "videos": bool(YOUTUBE_API_KEY), "aiScan": bool(os.getenv("GEMINI_API_KEY"))}


class LocationBody(BaseModel):
    lat: float
    lng: float


@app.post("/api/me/location")
def set_location(body: LocationBody, user: schema.User = Depends(current_user), db: Session = Depends(database.get_db)):
    if not valid_coords(body.lat, body.lng):
        raise HTTPException(status_code=400, detail="That location is not valid.")
    user.lat, user.lng = body.lat, body.lng
    db.commit()
    return user_json(user)


# ---------------------------------------------------------------- notifications
def notify(db: Session, user_id: int, text_: str, link: str = ""):
    db.add(schema.Notification(user_id=user_id, text=text_, link=link))


@app.get("/api/notifications")
def list_notifications(user: schema.User = Depends(current_user), db: Session = Depends(database.get_db)):
    rows = (
        db.query(schema.Notification).filter(schema.Notification.user_id == user.id)
        .order_by(schema.Notification.id.desc()).limit(30).all()
    )
    unread = db.query(schema.Notification).filter(schema.Notification.user_id == user.id, schema.Notification.read.is_(False)).count()
    return {
        "unread": unread,
        "notifications": [
            {"id": n.id, "text": n.text, "link": n.link, "read": bool(n.read), "createdAt": n.created_at.isoformat() + "Z"} for n in rows
        ],
    }


@app.post("/api/notifications/read")
def read_notifications(user: schema.User = Depends(current_user), db: Session = Depends(database.get_db)):
    db.execute(update(schema.Notification).where(schema.Notification.user_id == user.id, schema.Notification.read.is_(False)).values(read=True))
    db.commit()
    return {"ok": True}


# ---------------------------------------------------------------- scan (Gemini)
SCAN_KEYS = ["paper", "plastic", "metal", "glass", "ewaste"]
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
_gemini = None


def get_gemini():
    global _gemini
    if _gemini is None:
        key = os.getenv("GEMINI_API_KEY")
        if not key:
            return None
        try:
            import google.generativeai as genai
            genai.configure(api_key=key)
            _gemini = genai.GenerativeModel(GEMINI_MODEL)
        except Exception:
            return None
    return _gemini


class ScanBody(BaseModel):
    image: str  # base64 JPEG, no data: prefix


def sniff_mime(data: bytes) -> Optional[str]:
    if data[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    return None


SCAN_PROMPT = (
    "You are sorting household scrap for an Indian recycling app. Look at the main item in the photo.\n"
    "Reply with JSON only, with these keys:\n"
    '  "material": one of "paper","plastic","metal","glass","ewaste","unknown"\n'
    '  "priceId": the closest of these ids, or null if none fits: ' + ", ".join(PRICE_IDS) + "\n"
    '  "item": what it is, 1 to 4 words (for example "PET bottle")\n'
    '  "confidence": "high", "medium" or "low"\n'
    "Rules: bottles of drinking water or soft drinks are pet. Cans are aluminium unless clearly steel. "
    "Phones, chargers, laptops, circuit boards, batteries, monitors are ewaste (a lead-acid battery is metal id batteries). "
    'If the photo is blurry, empty, or not scrap, use material "unknown" and confidence "low". Do not guess.'
)


@app.post("/api/scan")
def scan(body: ScanBody, request: Request):
    rate_limit(request, "scan", 20, 60)
    model = get_gemini()
    if model is None:
        # The frontend tells the person to pick the type by hand when this fails.
        raise HTTPException(status_code=503, detail="AI scan is not configured.")
    if len(body.image) > 8_000_000:
        raise HTTPException(status_code=413, detail="That photo is too large.")
    try:
        raw = base64.b64decode(body.image, validate=False)
    except Exception as e:
        print("SCAN ERROR:", repr(e))
        raise HTTPException(status_code=502, detail=f"Scan failed: {str(e)[:120]}")
    mime = sniff_mime(raw)
    if not mime:
        raise HTTPException(status_code=400, detail="Please send a JPEG, PNG or WebP photo.")
    try:
        resp = model.generate_content(
            [SCAN_PROMPT, {"mime_type": mime, "data": raw}],
            generation_config={"response_mime_type": "application/json", "temperature": 0.1},
            request_options={"timeout": 30},
        )
        try:
            txt = resp.text or ""
        except ValueError:  # blocked or empty answer
            return {"material": None, "labels": [], "priceId": None, "confidence": "low"}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Scan failed: {str(e)[:120]}")
    try:
        data = json.loads(re.sub(r"^```(?:json)?|```$", "", txt.strip(), flags=re.M).strip())
        if isinstance(data, list):
            data = data[0] if data else {}
    except Exception:
        data = {}
    material = str(data.get("material", "")).lower().replace("-", "").replace(" ", "")
    material = {"electronics": "ewaste", "ewaste": "ewaste"}.get(material, material)
    conf = str(data.get("confidence", "low")).lower()
    price_id = data.get("priceId")
    if material not in SCAN_KEYS or conf == "low":
        return {"material": None, "labels": [], "priceId": None, "confidence": "low"}
    if price_id not in PRICE_MATERIAL or PRICE_MATERIAL[price_id] != material:
        price_id = None  # the AI named an item that does not belong to the material it chose, so ignore the item
    item = str(data.get("item", "")).strip()[:40]
    return {"material": material, "labels": [{"name": item}] if item else [], "priceId": price_id, "confidence": conf}


# ---------------------------------------------------------------- pickups
class ItemBody(BaseModel):
    type: str
    kg: float


class PickupBody(BaseModel):
    address: str
    pincode: str
    phone: str = ""
    slot: str = ""
    notes: str = ""
    items: list[ItemBody]
    lat: Optional[float] = None
    lng: Optional[float] = None


def pickup_json(p: schema.Pickup, private: bool = True, viewer: Optional[schema.User] = None):
    d = {
        "id": f"SS-{p.id:04d}",
        "status": p.status,
        "createdAt": p.created_at.isoformat() + "Z" if p.created_at else None,
        "pincode": p.pincode,
        "slot": p.slot,
        "items": json.loads(p.items_json),
        "estLow": p.est_low,
        "estHigh": p.est_high,
        "collectorName": p.collector.name if p.collector else None,
        "rating": p.rating,
        "review": p.review or "",
    }
    if p.lat is not None and p.lng is not None:
        # Collectors only get the rounded spot (about 1 km) until they accept; the owner and the accepting collector get the exact one.
        d["areaLat"], d["areaLng"] = area_coord(p.lat), area_coord(p.lng)
        if viewer is not None and viewer.role == "collector" and viewer.lat is not None:
            d["distanceKm"] = round(haversine_km(viewer.lat, viewer.lng, d["areaLat"], d["areaLng"]), 1)
    if private:  # address, phone and name stay hidden until a collector accepts
        d.update(address=p.address, phone=p.phone, notes=p.notes, ownerName=p.owner.name, lat=p.lat, lng=p.lng, finalAmount=p.final_amount)
    return d


def parse_id(public_id: str) -> int:
    try:
        return int(public_id.replace("SS-", ""))
    except ValueError:
        raise HTTPException(status_code=404, detail="Pickup not found.")


@app.post("/api/pickups")
def create_pickup(body: PickupBody, user: schema.User = Depends(current_user), db: Session = Depends(database.get_db)):
    need_role(user, "customer", "Only customers can book pickups.")
    if not body.address.strip() or not (body.pincode.isdigit() and len(body.pincode) == 6):
        raise HTTPException(status_code=400, detail="Enter an address and a 6 digit pincode.")
    if not body.items:
        raise HTTPException(status_code=400, detail="Add at least one scrap type.")
    if (body.lat is not None or body.lng is not None) and not valid_coords(body.lat, body.lng):
        raise HTTPException(status_code=400, detail="That location is not valid.")
    prices = price_map(db)
    items, lo, hi = [], 0.0, 0.0
    for it in body.items:
        price = prices.get(it.type)
        if not price or not (0 < it.kg <= 500):
            raise HTTPException(status_code=400, detail="Check the scrap types and weights.")
        items.append({"type": it.type, "kg": it.kg})
        lo += it.kg * price["low"]
        hi += it.kg * price["high"]
    p = schema.Pickup(
        owner_id=user.id, address=body.address.strip(), pincode=body.pincode, phone=body.phone.strip(),
        slot=body.slot.strip(), notes=body.notes.strip(), items_json=json.dumps(items),
        est_low=round(lo), est_high=round(hi), lat=body.lat, lng=body.lng,
    )
    db.add(p)
    db.flush()
    if p.lat is not None:  # tell the closest collectors first
        near = []
        for c in db.query(schema.User).filter(schema.User.role == "collector", schema.User.lat.isnot(None)).all():
            km = haversine_km(c.lat, c.lng, area_coord(p.lat), area_coord(p.lng))
            if km <= NOTIFY_RADIUS_KM:
                near.append((km, c))
        for km, c in sorted(near, key=lambda x: x[0])[:10]:
            notify(db, c.id, f"New pickup request {km:.1f} km from you ({round(sum(i['kg'] for i in items), 1)} kg of scrap).", "#/dashboard")
    db.commit()
    db.refresh(p)
    return {"pickup": pickup_json(p)}


@app.get("/api/pickups")
def my_pickups(user: schema.User = Depends(current_user), db: Session = Depends(database.get_db)):
    col = schema.Pickup.collector_id if user.role == "collector" else schema.Pickup.owner_id
    rows = db.query(schema.Pickup).filter(col == user.id).order_by(schema.Pickup.id.desc()).all()
    return {"pickups": [pickup_json(p, viewer=user) for p in rows]}


@app.get("/api/pickups/open")
def open_pickups(user: schema.User = Depends(current_user), db: Session = Depends(database.get_db)):
    need_role(user, "collector", "Only collectors can see open requests.")
    rows = db.query(schema.Pickup).filter(schema.Pickup.status == "open").order_by(schema.Pickup.id.desc()).all()
    out = [pickup_json(p, private=False, viewer=user) for p in rows]
    # nearest first; requests with no known distance go after those that have one
    out.sort(key=lambda d: (d.get("distanceKm") is None, d.get("distanceKm") or 0))
    return {"pickups": out}


@app.post("/api/pickups/{pickup_id}/accept")
def accept_pickup(pickup_id: str, user: schema.User = Depends(current_user), db: Session = Depends(database.get_db)):
    need_role(user, "collector", "Only collectors can accept pickups.")
    pid = parse_id(pickup_id)
    # Single UPDATE so two collectors can't both claim the same request.
    res = db.execute(
        update(schema.Pickup)
        .where(schema.Pickup.id == pid, schema.Pickup.status == "open")
        .values(status="accepted", collector_id=user.id)
    )
    if res.rowcount == 0:
        db.rollback()
        raise HTTPException(status_code=409, detail="This request is no longer open.")
    p = db.get(schema.Pickup, pid)
    notify(db, p.owner_id, f"{user.name} accepted your pickup {pickup_id}. They will come in your time slot.", "#/pickups")
    db.commit()
    db.refresh(p)
    return {"pickup": pickup_json(p, viewer=user)}


class CompleteBody(BaseModel):
    finalAmount: Optional[float] = None


@app.post("/api/pickups/{pickup_id}/complete")
def complete_pickup(pickup_id: str, body: Optional[CompleteBody] = None, user: schema.User = Depends(current_user), db: Session = Depends(database.get_db)):
    need_role(user, "collector", "Only collectors can complete pickups.")
    amount = body.finalAmount if body else None
    if amount is not None and not (0 <= amount <= 1_000_000):
        raise HTTPException(status_code=400, detail="Enter a valid amount.")
    pid = parse_id(pickup_id)
    res = db.execute(
        update(schema.Pickup)
        .where(schema.Pickup.id == pid, schema.Pickup.collector_id == user.id, schema.Pickup.status == "accepted")
        .values(status="completed", final_amount=amount)
    )
    if res.rowcount == 0:
        db.rollback()
        raise HTTPException(status_code=409, detail="You can only complete a pickup you accepted.")
    p = db.get(schema.Pickup, pid)
    notify(db, p.owner_id, f"Pickup {pickup_id} is complete. Tell us how {user.name} did: rate your collector.", "#/pickups")
    db.commit()
    db.refresh(p)
    return {"pickup": pickup_json(p, viewer=user)}


@app.post("/api/pickups/{pickup_id}/cancel")
def cancel_pickup(pickup_id: str, user: schema.User = Depends(current_user), db: Session = Depends(database.get_db)):
    need_role(user, "customer", "Only the customer can cancel a pickup.")
    pid = parse_id(pickup_id)
    p = db.get(schema.Pickup, pid)
    if not p or p.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Pickup not found.")
    collector_id = p.collector_id
    res = db.execute(
        update(schema.Pickup)
        .where(schema.Pickup.id == pid, schema.Pickup.owner_id == user.id, schema.Pickup.status.in_(["open", "accepted"]))
        .values(status="cancelled")
    )
    if res.rowcount == 0:
        db.rollback()
        raise HTTPException(status_code=409, detail="This pickup can no longer be cancelled.")
    if collector_id:
        notify(db, collector_id, f"Pickup {pickup_id} was cancelled by the customer.", "#/pickups")
    db.commit()
    db.refresh(p)
    return {"pickup": pickup_json(p)}


class RateBody(BaseModel):
    rating: int
    review: str = ""


@app.post("/api/pickups/{pickup_id}/rate")
def rate_pickup(pickup_id: str, body: RateBody, user: schema.User = Depends(current_user), db: Session = Depends(database.get_db)):
    need_role(user, "customer", "Only the customer can rate a pickup.")
    if not 1 <= body.rating <= 5:
        raise HTTPException(status_code=400, detail="Choose 1 to 5 stars.")
    pid = parse_id(pickup_id)
    p = db.get(schema.Pickup, pid)
    if not p or p.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Pickup not found.")
    res = db.execute(
        update(schema.Pickup)
        .where(schema.Pickup.id == pid, schema.Pickup.status == "completed", schema.Pickup.rating.is_(None))
        .values(rating=body.rating, review=body.review.strip()[:300])
    )
    if res.rowcount == 0:
        db.rollback()
        raise HTTPException(status_code=409, detail="You can rate a completed pickup once.")
    if p.collector_id:
        notify(db, p.collector_id, f"You got {body.rating} star{'s' if body.rating != 1 else ''} for pickup {pickup_id}.", "#/dashboard")
    db.commit()
    db.refresh(p)
    return {"pickup": pickup_json(p)}


# ---------------------------------------------------------------- stats (dashboard)
def _kg(p: schema.Pickup) -> float:
    return sum(float(i.get("kg", 0)) for i in json.loads(p.items_json))


@app.get("/api/stats")
def my_stats(user: schema.User = Depends(current_user), db: Session = Depends(database.get_db)):
        if user.role == "collector":
            done = db.query(schema.Pickup).filter(schema.Pickup.collector_id == user.id, schema.Pickup.status == "completed").all()
        prices = price_map(db)
        profit = 0.0
        for p in done:
            # profit = what a recycler would pay for the scrap, minus what the collector paid the customer.
            # The amount the collector typed in when marking it collected is used when there is one.
            revenue, est_pay = 0.0, 0.0
            for i in json.loads(p.items_json):
                r = prices.get(i["type"])
                if r:
                    kg = float(i["kg"])
                    revenue += kg * (r["sellLow"] + r["sellHigh"]) / 2
                    est_pay += kg * (r["low"] + r["high"]) / 2
            pay = p.final_amount if p.final_amount is not None else est_pay
            profit += revenue - pay
        kg_total = sum(_kg(p) for p in done)
        rated = [p.rating for p in done if p.rating]
        return {
            "kg": round(kg_total, 1), "completed": len(done), "earned": round(profit), "co2Kg": round(kg_total * CO2_PER_KG, 1),
            "ratingAvg": round(sum(rated) / len(rated), 1) if rated else None, "ratingCount": len(rated),
        }
        mine = db.query(schema.Pickup).filter(schema.Pickup.owner_id == user.id).all()
        done = [p for p in mine if p.status == "completed"]
        kg = sum(_kg(p) for p in done)
        earned = sum(p.final_amount if p.final_amount is not None else (p.est_low + p.est_high) / 2 for p in done)
        return {
        "kg": round(kg, 1), "completed": len(done), "earned": round(earned), "co2Kg": round(kg * CO2_PER_KG, 1),
        "active": len([p for p in mine if p.status in ("open", "accepted")]),
    }


# ---------------------------------------------------------------- about / contact pages, messages
CONTENT_KEYS = ("about", "contact")


def clean_text(v, n=600) -> str:
    return str(v or "").strip()[:n]


@app.get("/api/content")
def get_content(db: Session = Depends(database.get_db)):
    out = {k: None for k in CONTENT_KEYS}
    for r in db.query(schema.SiteContent).all():
        if r.key in out:
            out[r.key] = json.loads(r.value_json)
    return out


class ContactBody(BaseModel):
    name: str
    contact: str
    message: str


@app.post("/api/contact")
def send_contact(body: ContactBody, request: Request, db: Session = Depends(database.get_db)):
    rate_limit(request, "contact", 5, 600)
    name, contact, message = body.name.strip(), body.contact.strip(), body.message.strip()
    if not (name and contact and message) or len(name) > 100 or len(contact) > 150 or len(message) > 2000:
        raise HTTPException(status_code=400, detail="Fill in all three fields (the message can be up to 2000 characters).")
    db.add(schema.ContactMessage(name=name, contact=contact, message=message))
    db.commit()
    return {"ok": True}


# ---------------------------------------------------------------- tutorial videos (YouTube)
_video_cache = {}


@app.get("/api/videos")
def videos(q: str, request: Request):
    if not YOUTUBE_API_KEY:
        raise HTTPException(status_code=503, detail="Videos are not configured.")
    rate_limit(request, "videos", 30, 60)
    q = q.strip()[:120]
    if not q:
        return []
    hit = _video_cache.get(q)
    if hit and time.time() - hit[0] < 6 * 3600:  # cache so each search costs YouTube quota only once
        return hit[1]
    url = "https://www.googleapis.com/youtube/v3/search?" + urllib.parse.urlencode({
        "part": "snippet", "type": "video", "videoEmbeddable": "true", "safeSearch": "strict",
        "maxResults": 6, "q": q, "key": YOUTUBE_API_KEY,
    })
    try:
        with urllib.request.urlopen(url, timeout=8) as r:
            data = json.loads(r.read())
    except Exception:
        raise HTTPException(status_code=502, detail="Could not load videos right now.")
    out = [
        {"id": it["id"]["videoId"], "title": html.unescape(it["snippet"]["title"]), "channel": html.unescape(it["snippet"]["channelTitle"])}
        for it in data.get("items", []) if it.get("id", {}).get("videoId")
    ]
    if len(_video_cache) > 500:
        _video_cache.clear()
    _video_cache[q] = (time.time(), out)
    return out


# ---------------------------------------------------------------- admin
def admin_user(user: schema.User = Depends(current_user)) -> schema.User:
    need_role(user, "admin", "Admins only.")
    return user


@app.get("/api/admin/overview")
def admin_overview(_: schema.User = Depends(admin_user), db: Session = Depends(database.get_db)):
    def n(status):
        return db.query(schema.Pickup).filter(schema.Pickup.status == status).count()
    return {
        "customers": db.query(schema.User).filter(schema.User.role == "customer").count(),
        "collectors": db.query(schema.User).filter(schema.User.role == "collector").count(),
        "pickups": {"open": n("open"), "accepted": n("accepted"), "completed": n("completed"), "cancelled": n("cancelled")},
        "messages": db.query(schema.ContactMessage).count(),
    }


@app.get("/api/admin/prices")
def admin_prices(_: schema.User = Depends(admin_user), db: Session = Depends(database.get_db)):
    rows = {r.id: r for r in db.query(schema.PriceRow).all()}
    out = []
    for i in PRICE_IDS:
        r = rows.get(i)
        if r:
            e = effective(r)
            out.append({"id": i, "base": {"low": r.low, "high": r.high, "sellLow": r.sell_low, "sellHigh": r.sell_high},
                        "trend": r.trend or 0, "low": e["low"], "high": e["high"]})
    return out


class PriceBody(BaseModel):
    low: float
    high: float
    sellLow: float
    sellHigh: float
    trend: float = 0


@app.put("/api/admin/prices/{price_id}")
def admin_set_price(price_id: str, body: PriceBody, _: schema.User = Depends(admin_user), db: Session = Depends(database.get_db)):
    r = db.get(schema.PriceRow, price_id)
    if not r:
        raise HTTPException(status_code=404, detail="Unknown scrap type.")
    vals = [body.low, body.high, body.sellLow, body.sellHigh]
    if any(v < 0 or v > 100000 for v in vals) or body.high < body.low or body.sellHigh < body.sellLow:
        raise HTTPException(status_code=400, detail="Check the rates: the high value must not be below the low one.")
    if not -50 <= body.trend <= 100:
        raise HTTPException(status_code=400, detail="Trend must be between -50% and 100%.")
    r.low, r.high, r.sell_low, r.sell_high = round(body.low), round(body.high), round(body.sellLow), round(body.sellHigh)
    r.trend, r.updated_at = body.trend, datetime.utcnow()
    db.commit()
    return effective(r)


@app.put("/api/admin/content/{key}")
def admin_set_content(key: str, body: dict, _: schema.User = Depends(admin_user), db: Session = Depends(database.get_db)):
    if key not in CONTENT_KEYS:
        raise HTTPException(status_code=404, detail="Unknown page.")
    v = body.get("value")
    if not isinstance(v, dict):
        raise HTTPException(status_code=400, detail="Missing content.")
    if key == "about":
        pts = v.get("points") if isinstance(v.get("points"), list) else []
        value = {
            "headline": clean_text(v.get("headline"), 200), "lead": clean_text(v.get("lead"), 800),
            "points": [[clean_text(p[0], 80), clean_text(p[1], 400)] for p in pts[:6] if isinstance(p, list) and len(p) == 2],
        }
    else:
        value = {k: clean_text(v.get(k), 200) for k in ("email", "phone", "whatsapp", "address", "hours")}
    row = db.get(schema.SiteContent, key)
    if row:
        row.value_json = json.dumps(value)
    else:
        db.add(schema.SiteContent(key=key, value_json=json.dumps(value)))
    db.commit()
    return {"ok": True}


@app.get("/api/admin/messages")
def admin_messages(_: schema.User = Depends(admin_user), db: Session = Depends(database.get_db)):
    rows = db.query(schema.ContactMessage).order_by(schema.ContactMessage.id.desc()).limit(100).all()
    return [{"id": m.id, "name": m.name, "contact": m.contact, "message": m.message, "createdAt": m.created_at.isoformat() + "Z"} for m in rows]


# ---------------------------------------------------------------- original routes (kept)
PRICING_PER_KG = {"Plastic": 15.0, "Metal": 30.0, "Paper": 10.0, "Glass": 5.0, "Unknown": 2.0}


@app.post("/api/analyze-garbage")
async def analyze_garbage(
    location: str = Form(...),
    weight_kg: float = Form(...),
    user_id: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db),
):
    model = get_gemini()
    if model is None:
        raise HTTPException(status_code=503, detail="AI scan is not configured (set GEMINI_API_KEY).")
    try:
        image_data = await file.read()
        prompt = """
        Analyze this image of waste.
        1. Identify the primary recyclable material. You MUST choose exactly one from this list: Plastic, Metal, Paper, Glass, or Unknown.
        2. Provide one short, practical, and creative upcycling idea for this specific item.
        Format your response exactly like this:
        Material: [Type]
        Idea: [Your idea]
        """
        text_ = model.generate_content([prompt, {"mime_type": file.content_type, "data": image_data}]).text
        material, idea = "Unknown", "No idea generated."
        if "Material:" in text_ and "Idea:" in text_:
            parts = text_.split("Idea:")
            material = parts[0].replace("Material:", "").strip()
            idea = parts[1].strip()
        total_quote = round(PRICING_PER_KG.get(material, 5.0) * weight_kg, 2)
        req = schema.ScrapRequest(
            user_id=user_id, user_location=location, material_type=material, weight_kg=weight_kg,
            upcycle_idea=idea, estimated_quote=total_quote,
        )
        db.add(req)
        db.commit()
        db.refresh(req)
        return {"id": req.id, "material": material, "weight_kg": weight_kg, "idea": idea, "total_quote": total_quote}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/requests/local")
def get_local_requests(db: Session = Depends(database.get_db)):
    return db.query(schema.ScrapRequest).filter(schema.ScrapRequest.status == "Pending").all()


@app.put("/api/requests/{request_id}/accept")
def accept_request(request_id: int, collector_id: str, db: Session = Depends(database.get_db)):
    r = db.query(schema.ScrapRequest).filter(schema.ScrapRequest.id == request_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")
    r.status, r.collector_id = "Accepted", collector_id
    db.commit()
    return {"message": "Pickup accepted!", "request_id": request_id}


@app.put("/api/requests/{request_id}/complete")
def complete_request(request_id: int, db: Session = Depends(database.get_db)):
    r = db.query(schema.ScrapRequest).filter(schema.ScrapRequest.id == request_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")
    r.status = "Completed"
    db.commit()
    return {"message": "Job finished!", "request_id": request_id}


@app.get("/api/users/{user_id}/stats")
def get_user_stats(user_id: str, db: Session = Depends(database.get_db)):
    done = db.query(schema.ScrapRequest).filter(
        schema.ScrapRequest.user_id == user_id, schema.ScrapRequest.status == "Completed"
    ).all()
    earned = sum(r.estimated_quote for r in done if r.estimated_quote)
    weight = sum(r.weight_kg for r in done if r.weight_kg)
    return {
        "user_id": user_id,
        "completed_pickups": len(done),
        "total_money_earned": round(earned, 2),
        "total_co2_saved_kg": round(weight * CO2_PER_KG, 2),
    }


# ---------------------------------------------------------------- startup: prices, demo accounts, admin
@app.on_event("startup")
def startup_seed():
    db = database.SessionLocal()
    try:
        seed_prices(db)
        if os.getenv("SEED_DEMO", "1") != "0":
            for username, name, role in [("demo", "Demo Customer", "customer"), ("collector", "Demo Collector", "collector")]:
                if not db.query(schema.User).filter(schema.User.username == username).first():
                    db.add(schema.User(username=username, name=name, role=role, password_hash=hash_password("scrap123")))
        # The admin account comes from .env only (ADMIN_USERNAME + ADMIN_PASSWORD); there is no default admin password.
        a_user, a_pass = os.getenv("ADMIN_USERNAME", "").strip().lower(), os.getenv("ADMIN_PASSWORD", "")
        if a_user and len(a_pass) >= 8:
            admin = db.query(schema.User).filter(schema.User.username == a_user).first()
            if not admin:
                db.add(schema.User(username=a_user, name="Admin", role="admin", password_hash=hash_password(a_pass)))
            else:
                admin.role, admin.password_hash = "admin", hash_password(a_pass)
        db.commit()
    finally:
        db.close()


@app.get("/api/health")
def health():
    return {"ok": True}


# Must come last so it doesn't shadow the /api routes.
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
