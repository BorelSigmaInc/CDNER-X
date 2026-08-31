from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.database import engine
from .models.database import Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Yosemite Quantum Bonding Engine",
    version="1.1.0",
    description="Quantum-safe multi-path connectivity for CDNER-X (customer portal + internal console)",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
from .api import bonding
app.include_router(bonding.router)

from .api import quantum
app.include_router(quantum.router)

from .api import qkd
app.include_router(qkd.router)

from .api import auth
app.include_router(auth.router)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "quantum": "ready"}
