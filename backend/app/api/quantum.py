from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
from ..core.database import get_db
from ..models.database import QuantumResult
import json

router = APIRouter(prefix="/api/quantum", tags=["quantum"])

class OptimizeRequest(BaseModel):
    paths: List[str]

@router.post("/optimize")
async def optimize_quantum_path(request: OptimizeRequest, db: Session = Depends(get_db)):
    """Run a simple Bell state circuit to pick best path and store result."""
    paths = request.paths
    if not paths:
        return {"error": "No paths provided"}

    # Simple 2-qubit circuit for demonstration
    qc = QuantumCircuit(2, 2)
    qc.h(0)
    qc.cx(0, 1)
    qc.measure([0, 1], [0, 1])
    sim = AerSimulator()
    result = sim.run(qc, shots=1024).result()
    counts = result.get_counts(qc)

    # Selection logic
    selected = paths[0] if counts.get("00", 0) > counts.get("11", 0) else paths[-1]

    # Save to database
    result_record = QuantumResult(
        user_id=1,  # Placeholder user_id
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
        "quantum_result_id": result_record.id
    }
