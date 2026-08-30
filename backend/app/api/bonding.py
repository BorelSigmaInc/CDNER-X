from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.database import BondingSession

router = APIRouter(prefix="/api/bonding", tags=["bonding"])

@router.get("/status")
async def get_bonding_status():
    return {
        "status": "active",
        "throughput": "250 Mbps",
        "latency": "15 ms",
        "interfaces": ["Starlink", "5G", "Fiber"],
        "active_sessions": 7
    }

@router.post("/start")
async def start_bonding(user_id: int, db: Session = Depends(get_db)):
    if user_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid user_id")
    session = BondingSession(user_id=user_id, status="active")
    db.add(session)
    db.commit()
    db.refresh(session)
    return {
        "status": "success",
        "user_id": user_id,
        "session_id": session.id,
        "message": "Bonding session started"
    }
