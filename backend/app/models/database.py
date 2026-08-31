from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="customer")  # customer | partner | operator
    created_at = Column(DateTime, default=datetime.utcnow)


class Partner(Base):
    __tablename__ = "partners"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    company = Column(String, nullable=False)
    region = Column(String, default="eu-central")
    specialty = Column(String, default="bonding")
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)


class CatalogOffer(Base):
    __tablename__ = "catalog_offers"
    id = Column(Integer, primary_key=True, index=True)
    partner_id = Column(Integer, index=True)
    sku = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    plan = Column(String, default="standard")
    monthly_usd = Column(Float, nullable=False)
    setup_usd = Column(Float, default=0)
    description = Column(String)
    retail_usd = Column(Float, default=0)
    upgrade_sku = Column(String)
    family = Column(String)
    specs = Column(String)


class Estimate(Base):
    __tablename__ = "estimates"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    region = Column(String)
    term_months = Column(Integer, default=12)
    items_json = Column(String)
    monthly_usd = Column(Float)
    setup_usd = Column(Float)
    status = Column(String, default="draft")
    created_at = Column(DateTime, default=datetime.utcnow)


class ServiceOrder(Base):
    __tablename__ = "service_orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    partner_id = Column(Integer, index=True)
    offer_id = Column(Integer, index=True)
    service_name = Column(String)
    region = Column(String)
    plan = Column(String)
    monthly_usd = Column(Float)
    status = Column(String, default="provisioning")  # provisioning | active | on_call | closed
    created_at = Column(DateTime, default=datetime.utcnow)


class SupportTicket(Base):
    __tablename__ = "support_tickets"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, index=True)
    partner_id = Column(Integer, index=True)
    user_id = Column(Integer, index=True)
    title = Column(String, nullable=False)
    severity = Column(String, default="medium")
    status = Column(String, default="open")
    created_at = Column(DateTime, default=datetime.utcnow)

class BondingSession(Base):
    __tablename__ = "bonding_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    interfaces = Column(String)  # JSON string for simplicity
    throughput = Column(Float)
    latency = Column(Float)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

class QuantumResult(Base):
    __tablename__ = "quantum_results"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    algorithm = Column(String)  # e.g., "bell_state", "bb84"
    result_data = Column(String)  # JSON string
    execution_time = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
