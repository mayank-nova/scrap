# Scrap Setu

One app: the FastAPI backend serves the API at `/api/...` and the frontend at `/`.

## Run

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                               # optional keys, see below
uvicorn main:app --reload
```

Open http://localhost:8000

Demo logins (password `scrap123`): `demo` (customer) and `collector` (collector).
Set `SEED_DEMO=0` to skip creating them.

## How it fits together
- `frontend/` is plain static HTML/JS, served by FastAPI's `StaticFiles`. `frontend/config.js` sets `apiUrl: "/api"` (same origin, no CORS issues).
- Login/signup: `/api/auth/*` (hashed passwords, signed tokens). Replaces the old AWS Cognito code.
- Pickups: `/api/pickups`, `/api/pickups/open`, `/api/pickups/{id}/accept|complete`.
- Scanner: `/api/scan` (Gemini). If no key is set it returns 503 and the frontend uses its colour-based guess.
- The original `/api/analyze-garbage`, `/api/requests/*` and `/api/users/*/stats` routes are kept.

## Settings (backend/.env)
| Key | What it switches on |
|---|---|
| `GEMINI_API_KEY` | AI photo scan. Without it the scanner tells the person to pick the scrap type by hand. |
| `GOOGLE_CLIENT_ID` | "Sign in with Google". Create an OAuth *Web* client in Google Cloud and add your site URL (e.g. `http://localhost:8000`) as an authorised JavaScript origin. |
| `YOUTUBE_API_KEY` | Tutorial videos play inside the site. Without it the "Watch tutorial" links open YouTube. |
| `ADMIN_USERNAME` + `ADMIN_PASSWORD` | Creates the admin account on startup (8+ character password). Admin can edit rates, the About and Contact pages and read contact messages. |
| `NOTIFY_RADIUS_KM` | Collectors with a saved location this close get a notification for a new request (default 10). |

## Added in this version
- Google sign-in, notifications bell, cancel pickup, 1-5 star ratings, CO2 / kg / earnings stats, collector map and distances.
- Customers can share their location; collectors see requests nearest first. Collectors only get a spot rounded to about 1 km until they accept.
- Rates, About and Contact content and contact messages live in the database (`scrap.db`). Admin edits rates and a market trend % per item; customers see the change within a minute.
- New e-waste rates: laptops, circuit boards, batteries, TVs and monitors (sample numbers).
- `frontend/js/extras.js` holds the new screens; the backend routes for it are in `backend/main.py`.
- An older `scrap.db` is upgraded automatically on start (new columns are added, nothing is deleted).
