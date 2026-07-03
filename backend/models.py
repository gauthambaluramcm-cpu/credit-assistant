from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String)
    email      = Column(String, unique=True, index=True)
    mobile     = Column(String)
    password   = Column(String)
    created_at = Column(DateTime, server_default=func.now())

class CreditProfile(Base):
    __tablename__ = "credit_profiles"

    id              = Column(Integer, primary_key=True, index=True)
    user_id         = Column(Integer)
    credit_score    = Column(Integer)
    utilization     = Column(Float)
    missed_payments = Column(Integer)
    active_loans    = Column(Integer)
    monthly_salary  = Column(Float)
    monthly_expenses= Column(Float)
    monthly_savings = Column(Float)
    debt_to_income  = Column(Float)
    created_at      = Column(DateTime, server_default=func.now())

class ScoreHistory(Base):
    __tablename__ = "score_history"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer)
    old_score   = Column(Integer)
    new_score   = Column(Integer)
    improvement = Column(Integer)
    recorded_at = Column(DateTime, server_default=func.now())