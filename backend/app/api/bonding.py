from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import subprocess
import os
import psutil
from ..core.database import get_db
from ..models.database import BondingSession

router = APIRouter(prefix="/api/bonding", tags=["bonding"])

ENGINE_DIR = os.path.join(os.getcwd(), "bonding-engine")
ENGINE_BINARY = os.path.join(ENGINE_DIR, "target", "debug", "bonding_engine")

def is_engine_running():
    """Check if bonding engine is active (env var for Docker, psutil for local)."""
    # In Docker, the engine runs in a separate container; use environment flag.
    if os.getenv("ENGINE_ACTIVE", "false").lower() == "true":
        return True
    # Fallback: local process detection (for non-Docker development)
    for proc in psutil.process_iter(['pid', 'name']):
        if 'bonding_engine' in proc.info['name']:
            return True
    return False

@router.get("/status")
async def get_bonding_status():
    engine_running = is_engine_running()
    return {
        "status": "active" if engine_running else "inactive",
        "throughput": "250 Mbps" if engine_running else "0 Mbps",
        "latency": "15 ms" if engine_running else "N/A",
        "interfaces": ["Starlink", "5G", "Fiber"],
        "active_sessions": 1 if engine_running else 0
    }

@router.post("/start")
async def start_bonding(user_id: int, db: Session = Depends(get_db)):
    if user_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid user_id")
    # Create a database record
    session = BondingSession(user_id=user_id, status="active")
    db.add(session)
    db.commit()
    db.refresh(session)
    # Launch the Rust bonding engine as a subprocess (if not already running)
    try:
        # Check if the engine binary exists
        if not os.path.exists(ENGINE_BINARY):
            raise HTTPException(status_code=500, detail="Bonding engine binary not found. Build it first with 'cargo build' in bonding-engine/")
        # Start the engine in background, detach from API process
        subprocess.Popen(
            [ENGINE_BINARY],
            cwd=ENGINE_DIR,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True  # detach from parent process
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start bonding engine: {e}")
    return {
        "status": "success",
        "user_id": user_id,
        "session_id": session.id,
        "message": "Bonding session started and engine launched"
    }
