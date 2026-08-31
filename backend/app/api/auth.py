from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session
import bcrypt
from ..core.database import get_db
from ..models.database import User, Partner

router = APIRouter(prefix="/api/auth", tags=["auth"])


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
    except (ValueError, TypeError):
        return False


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)
    role: str = "customer"
    company: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


def _role_for(user: User) -> str:
    if user.email.endswith("@borelsigma.com"):
        return "operator"
    return user.role or "customer"


def _auth_payload(user: User, partner_id: int | None = None) -> dict:
    return {
        "status": "success",
        "user_id": user.id,
        "email": user.email,
        "is_active": bool(user.is_active),
        "role": _role_for(user),
        "partner_id": partner_id,
    }


@router.post("/register")
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    role = request.role if request.role in ("customer", "partner") else "customer"
    user = User(
        email=request.email,
        hashed_password=hash_password(request.password),
        is_active=True,
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    partner_id = None
    if role == "partner":
        partner = Partner(
            user_id=user.id,
            company=request.company or request.email.split("@")[0],
            region="eu-central",
            specialty="bonding",
            status="active",
        )
        db.add(partner)
        db.commit()
        db.refresh(partner)
        partner_id = partner.id
    return _auth_payload(user, partner_id)


@router.post("/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")
    partner = db.query(Partner).filter(Partner.user_id == user.id).first()
    return _auth_payload(user, partner.id if partner else None)
