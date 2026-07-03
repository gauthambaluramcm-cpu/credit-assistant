from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, get_db
from pydantic import BaseModel
from google import genai
import models
import hashlib
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        os.getenv("FRONTEND_URL", "https://credit-assistant.onrender.com")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Setup Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

models.Base.metadata.create_all(bind=engine)

# --- Schemas ---

class UserRegister(BaseModel):
    name: str
    email: str
    mobile: str
    password: str

class FinancialData(BaseModel):
    user_id: int
    credit_score: int
    utilization: float
    missed_payments: int
    active_loans: int
    monthly_salary: float
    monthly_expenses: float
    monthly_savings: float

# --- Routes ---

@app.get("/")
def home():
    return {"message": "Credit Assistant API is running!"}


@app.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()

    new_user = models.User(
        name=user.name,
        email=user.email,
        mobile=user.mobile,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id,
        "name": new_user.name
    }


@app.post("/financial-data")
def save_financial_data(data: FinancialData, db: Session = Depends(get_db)):
    dti = round(data.monthly_expenses / data.monthly_salary * 100, 2)

    profile = models.CreditProfile(
        user_id=data.user_id,
        credit_score=data.credit_score,
        utilization=data.utilization,
        missed_payments=data.missed_payments,
        active_loans=data.active_loans,
        monthly_salary=data.monthly_salary,
        monthly_expenses=data.monthly_expenses,
        monthly_savings=data.monthly_savings,
        debt_to_income=dti
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    # Auto save to score history
    last = db.query(models.ScoreHistory).filter(
        models.ScoreHistory.user_id == data.user_id
    ).order_by(models.ScoreHistory.recorded_at.desc()).first()

    old_score = last.new_score if last else data.credit_score
    improvement = data.credit_score - old_score

    history = models.ScoreHistory(
        user_id=data.user_id,
        old_score=old_score,
        new_score=data.credit_score,
        improvement=improvement
    )
    db.add(history)
    db.commit()

    return {
        "message": "Financial data saved successfully",
        "profile_id": profile.id,
        "debt_to_income": dti
    }


@app.get("/dashboard/{user_id}")
def get_dashboard(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile = db.query(models.CreditProfile).filter(
        models.CreditProfile.user_id == user_id
    ).order_by(models.CreditProfile.created_at.desc()).first()

    return {
        "user": user.name,
        "credit_score": profile.credit_score if profile else None,
        "utilization": profile.utilization if profile else None,
        "missed_payments": profile.missed_payments if profile else None,
        "debt_to_income": profile.debt_to_income if profile else None,
        "monthly_savings": profile.monthly_savings if profile else None
    }


@app.get("/recommendations/{user_id}")
def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(models.CreditProfile).filter(
        models.CreditProfile.user_id == user_id
    ).order_by(models.CreditProfile.created_at.desc()).first()

    if not profile:
        raise HTTPException(status_code=404, detail="No financial data found")

    prompt = f"""
    You are an expert Indian financial advisor specialising in CIBIL credit scores.
    
    Analyse this user's financial profile and give specific actionable advice:
    
    - Credit Score: {profile.credit_score} (out of 900)
    - Credit Utilization: {profile.utilization}%
    - Missed EMI Payments: {profile.missed_payments}
    - Active Loans: {profile.active_loans}
    - Monthly Salary: ₹{profile.monthly_salary}
    - Monthly Expenses: ₹{profile.monthly_expenses}
    - Monthly Savings: ₹{profile.monthly_savings}
    - Debt to Income Ratio: {profile.debt_to_income}%
    
    Provide:
    1. Overall assessment of their credit health
    2. Top 3 critical issues detected
    3. 5 specific actionable recommendations to improve their score
    4. Expected score improvement timeline
    
    Keep response clear and specific to Indian banking system.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {
        "user_id": user_id,
        "credit_score": profile.credit_score,
        "ai_recommendations": response.text
    }

@app.post("/save-score-history")
def save_score_history(user_id: int, new_score: int, db: Session = Depends(get_db)):
    # Get previous score
    last = db.query(models.ScoreHistory).filter(
        models.ScoreHistory.user_id == user_id
    ).order_by(models.ScoreHistory.recorded_at.desc()).first()

    old_score = last.new_score if last else new_score
    improvement = new_score - old_score

    history = models.ScoreHistory(
        user_id=user_id,
        old_score=old_score,
        new_score=new_score,
        improvement=improvement
    )
    db.add(history)
    db.commit()
    return {"message": "Score history saved"}


@app.get("/score-history/{user_id}")
def get_score_history(user_id: int, db: Session = Depends(get_db)):
    history = db.query(models.ScoreHistory).filter(
        models.ScoreHistory.user_id == user_id
    ).order_by(models.ScoreHistory.recorded_at.asc()).all()

    return [
        {
            "score": h.new_score,
            "improvement": h.improvement,
            "date": h.recorded_at.strftime("%d %b %Y")
        }
        for h in history
    ]

class UserLogin(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not existing:
        raise HTTPException(status_code=404, detail="Email not found. Please register first.")

    hashed = hashlib.sha256(user.password.encode()).hexdigest()
    if existing.password != hashed:
        raise HTTPException(status_code=401, detail="Incorrect password.")

    return {
        "message": "Login successful",
        "user_id": existing.id,
        "name": existing.name
    }

if __name__ == "__main__":
    import os
    import subprocess
    import uvicorn

    # Only start frontend once (prevent starting it again during uvicorn reload restarts)
    if not os.environ.get("FRONTEND_STARTED"):
        os.environ["FRONTEND_STARTED"] = "true"
        frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
        print(f"\n--- Starting React Frontend in background: {frontend_dir} ---\n")
        subprocess.Popen("npm start", cwd=frontend_dir, shell=True)

    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
