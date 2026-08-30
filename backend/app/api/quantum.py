from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

router = APIRouter(prefix="/api/quantum", tags=["quantum"])

class OptimizeRequest(BaseModel):
    paths: List[str]

@router.post("/optimize")
async def optimize_quantum_path(request: OptimizeRequest):
    """Run a simple Bell state circuit to pick best path."""
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
    # Mock selection: pick path based on deterministic rule
    selected = paths[0] if counts.get("00", 0) > counts.get("11", 0) else paths[-1]
    return {
        "status": "optimized",
        "selected_path": selected,
        "counts": counts
    }
