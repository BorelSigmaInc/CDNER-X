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
