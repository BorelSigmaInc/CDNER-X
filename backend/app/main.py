from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Yosemite Quantum Bonding Engine",
    version="1.0.0",
    description="Quantum-Safe Multi-Path Connectivity Platform"
)

from .core.database import engine
from .models.database import Base

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .api import bonding
app.include_router(bonding.router)
from .api import quantum
app.include_router(quantum.router)
from .api import qkd
app.include_router(qkd.router)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "quantum": "ready"}
