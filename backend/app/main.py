from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.database import engine, SessionLocal
from .core.schema import ensure_schema
from .models.database import Base
from .services.seed import seed_marketplace

Base.metadata.create_all(bind=engine)
ensure_schema()

db = SessionLocal()
try:
    seed_marketplace(db)
finally:
    db.close()

app = FastAPI(
    title="CDNER-X Yosemite Platform",
    version="2.0.0",
    description="Quantum-safe multi-path connectivity, partner marketplace, and customer estimator",
)

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

from .api import auth
app.include_router(auth.router)

from .api import marketplace
app.include_router(marketplace.router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "quantum": "ready", "platform": "cdner-x"}
