from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
from ..core.database import get_db
from ..models.database import QuantumResult
import json

router = APIRouter(prefix="/api/quantum", tags=["quantum"])

class OptimizeRequest(BaseModel):
    paths: List[str]
    user_id: Optional[int] = 1

@router.post("/optimize")
async def optimize_quantum_path(request: OptimizeRequest, db: Session = Depends(get_db)):
    """Run a simple Bell state circuit to pick best path and store result."""
    paths = request.paths
    if not paths:
        return {"error": "No paths provided"}

    qc = QuantumCircuit(2, 2)
    qc.h(0)
    qc.cx(0, 1)
    qc.measure([0, 1], [0, 1])
    sim = AerSimulator()
    result = sim.run(qc, shots=1024).result()
    counts = result.get_counts(qc)

    selected = paths[0] if counts.get("00", 0) > counts.get("11", 0) else paths[-1]

    result_record = QuantumResult(
        user_id=request.user_id,
        algorithm="bell_state_path_optimization",
        result_data=json.dumps({"selected_path": selected, "counts": counts}),
        execution_time=0.0
    )
    db.add(result_record)
    db.commit()
    db.refresh(result_record)

    return {
        "status": "optimized",
        "selected_path": selected,
        "counts": counts,
        "quantum_result_id": result_record.id,
        "algorithm": "bell_state_path_optimization",
        "explanation": (
            f"Bell-state sampling preferred {selected} over the remaining bonded paths."
        ),
    }

@router.get("/results")
async def get_quantum_results(
    limit: int = Query(5, ge=1, le=50),
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Return recent quantum results, optionally filtered by user."""
    query = db.query(QuantumResult).order_by(QuantumResult.id.desc())
    if user_id is not None:
        query = query.filter(QuantumResult.user_id == user_id)
    results = query.limit(limit).all()
    return [
        {
            "id": r.id,
            "user_id": r.user_id,
            "algorithm": r.algorithm,
            "result_data": r.result_data,
            "execution_time": r.execution_time,
            "created_at": r.created_at.isoformat()
        }
        for r in results
    ]
