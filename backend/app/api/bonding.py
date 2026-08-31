from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
import subprocess
import os
import psutil
from ..core.database import get_db
from ..models.database import BondingSession

router = APIRouter(prefix="/api/bonding", tags=["bonding"])

ENGINE_DIR = os.path.join(os.getcwd(), "bonding-engine")
ENGINE_BINARY = os.path.join(ENGINE_DIR, "target", "debug", "bonding_engine")

PATHS = [
    {"name": "Starlink", "kind": "satellite", "bind": "127.0.0.1:9001", "target": "127.0.0.1:10001"},
    {"name": "5G", "kind": "cellular", "bind": "127.0.0.1:9002", "target": "127.0.0.1:10002"},
    {"name": "Fiber", "kind": "terrestrial", "bind": "127.0.0.1:9003", "target": "127.0.0.1:10003"},
]


def engine_managed_by_compose() -> bool:
    return os.getenv("ENGINE_ACTIVE", "false").lower() == "true"


def is_engine_running():
    """Check if bonding engine is active (env var for Docker, psutil for local)."""
    if engine_managed_by_compose():
        return True
    for proc in psutil.process_iter(["pid", "name"]):
        if proc.info["name"] and "bonding_engine" in proc.info["name"]:
            return True
    return False


@router.get("/status")
async def get_bonding_status(db: Session = Depends(get_db)):
    engine_running = is_engine_running()
    recorded = db.query(BondingSession).filter(BondingSession.status == "active").count()
    return {
        "status": "active" if engine_running else "inactive",
        "throughput": "250 Mbps" if engine_running else "0 Mbps",
        "latency": "15 ms" if engine_running else "N/A",
        "interfaces": [path["name"] for path in PATHS],
        "active_sessions": recorded if recorded else (1 if engine_running else 0),
        "engine_running": engine_running,
        "engine_mode": "compose" if engine_managed_by_compose() else ("process" if engine_running else "offline"),
        "paths": PATHS,
        "policy": "round-robin UDP across satellite, cellular, and fiber",
    }


@router.get("/sessions")
async def list_sessions(
    user_id: Optional[int] = Query(None),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    query = db.query(BondingSession).order_by(BondingSession.id.desc())
    if user_id is not None:
        query = query.filter(BondingSession.user_id == user_id)
    rows = query.limit(limit).all()
    return [
        {
            "id": row.id,
            "user_id": row.user_id,
            "status": row.status,
            "throughput": row.throughput,
            "latency": row.latency,
            "created_at": row.created_at.isoformat() if row.created_at else None,
        }
        for row in rows
    ]


@router.post("/start")
async def start_bonding(user_id: int, db: Session = Depends(get_db)):
    if user_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid user_id")
    session = BondingSession(user_id=user_id, status="active")
    db.add(session)
    db.commit()
    db.refresh(session)

    if engine_managed_by_compose():
        return {
            "status": "success",
            "user_id": user_id,
            "session_id": session.id,
            "engine_managed": True,
            "message": "Bonding session recorded. Engine is already running in the compose stack.",
        }

    try:
        if not os.path.exists(ENGINE_BINARY):
            raise HTTPException(
                status_code=500,
                detail="Bonding engine binary not found. Build it first with 'cargo build' in bonding-engine/",
            )
        subprocess.Popen(
            [ENGINE_BINARY],
            cwd=ENGINE_DIR,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start bonding engine: {e}")
    return {
        "status": "success",
        "user_id": user_id,
        "session_id": session.id,
        "engine_managed": False,
        "message": "Bonding session started and engine launched",
    }
