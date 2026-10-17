from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, index=True, nullable=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="customer")  # "customer" | "collector" | "admin"
    password_hash = Column(String, nullable=False)
    google_sub = Column(String, unique=True, index=True, nullable=True)  # set for Google sign-in accounts
    lat = Column(Float, nullable=True)  # collector's own location (used to sort requests nearest first)
    lng = Column(Float, nullable=True)


class Pickup(Base):
    """A pickup request created by a customer and fulfilled by a collector."""
    __tablename__ = "pickups"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    collector_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=True)
    status = Column(String, default="open", index=True)  # open -> accepted -> completed (or cancelled)
    address = Column(String, nullable=False)
    pincode = Column(String, nullable=False)
    phone = Column(String, default="")
    slot = Column(String, default="")
    notes = Column(String, default="")
    items_json = Column(Text, nullable=False, default="[]")
    est_low = Column(Integer, default=0)
    est_high = Column(Integer, default=0)
    final_amount = Column(Float, nullable=True)  # what the collector actually paid, entered on completion
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    rating = Column(Integer, nullable=True)  # 1-5, given by the customer after completion
    review = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", foreign_keys=[owner_id])
    collector = relationship("User", foreign_keys=[collector_id])


class PriceRow(Base):
    """Admin-editable scrap rates. Effective price = base * (1 + trend/100)."""
    __tablename__ = "prices"

    id = Column(String, primary_key=True)
    low = Column(Integer, nullable=False)
    high = Column(Integer, nullable=False)
    sell_low = Column(Integer, nullable=False)
    sell_high = Column(Integer, nullable=False)
    trend = Column(Float, default=0.0)
    updated_at = Column(DateTime, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    text = Column(String, nullable=False)
    link = Column(String, default="")
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class SiteContent(Base):
    """About and Contact page content, edited from the admin panel. value_json holds the JSON."""
    __tablename__ = "site_content"

    key = Column(String, primary_key=True)  # "about" | "contact"
    value_json = Column(Text, nullable=False)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# Kept from the original backend (used by /api/analyze-garbage and friends).
class ScrapRequest(Base):
    __tablename__ = "scrap_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=True)
    user_location = Column(String, index=True)
    material_type = Column(String)
    weight_kg = Column(Float)
    upcycle_idea = Column(String)
    estimated_quote = Column(Float)
    status = Column(String, default="Pending")
    collector_id = Column(String, nullable=True)
