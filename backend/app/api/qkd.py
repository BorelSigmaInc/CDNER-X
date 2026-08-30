from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import numpy as np
import json
from ..core.database import get_db
from ..models.database import QuantumResult

router = APIRouter(prefix="/api/qkd", tags=["qkd"])

class QKDRequest(BaseModel):
    num_bits: int

@router.post("/generate")
async def generate_qkd(request: QKDRequest, db: Session = Depends(get_db)):
    """Simulate BB84 key generation and store result."""
    n = request.num_bits
    if n <= 0:
        return {"error": "num_bits must be positive"}

    # Alice's random bits and bases
    alice_bits = np.random.randint(0, 2, n)
    alice_bases = np.random.choice(['+', 'x'], n)
    # Bob's random bases
    bob_bases = np.random.choice(['+', 'x'], n)
    # Sifting
    sifted = []
    for a_bit, a_basis, b_basis in zip(alice_bits, alice_bases, bob_bases):
        if a_basis == b_basis:
            sifted.append(int(a_bit))
    key = ''.join(map(str, sifted))

    # Save to database
    result_record = QuantumResult(
        user_id=1,  # Placeholder
        algorithm="bb84",
        result_data=json.dumps({
            "sifted_key_length": len(sifted),
            "key": key,
            "alice_bases": list(alice_bases),
            "bob_bases": list(bob_bases)
        }),
        execution_time=0.0
    )
    db.add(result_record)
    db.commit()
    db.refresh(result_record)

    return {
        "status": "success",
        "sifted_key_length": len(sifted),
        "key": key,
        "alice_bases": list(alice_bases),
        "bob_bases": list(bob_bases),
        "quantum_result_id": result_record.id
    }
