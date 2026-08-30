from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np

router = APIRouter(prefix="/api/qkd", tags=["qkd"])

class QKDRequest(BaseModel):
    num_bits: int

@router.post("/generate")
async def generate_qkd(request: QKDRequest):
    """Simulate BB84 key generation."""
    n = request.num_bits
    if n <= 0:
        return {"error": "num_bits must be positive"}
    # Alice's random bits and bases
    alice_bits = np.random.randint(0, 2, n)
    alice_bases = np.random.choice(['+', 'x'], n)
    # Bob's random bases
    bob_bases = np.random.choice(['+', 'x'], n)
    # Sifting: keep bits where bases match
    sifted = []
    for a_bit, a_basis, b_basis in zip(alice_bits, alice_bases, bob_bases):
        if a_basis == b_basis:
            sifted.append(int(a_bit))
    key = ''.join(map(str, sifted))
    return {
        "status": "success",
        "sifted_key_length": len(sifted),
        "key": key,
        "alice_bases": list(alice_bases),
        "bob_bases": list(bob_bases)
    }
