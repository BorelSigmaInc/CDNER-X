from pydantic import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Yosemite Quantum Bonding"
    DATABASE_URL: str = "postgresql://yosemite:yosemite@localhost:5432/yosemite"
    REDIS_URL: str = "redis://localhost:6379/0"
    QISKIT_BACKEND: str = "ibmq_qasm_simulator"
    QKD_PROTOCOL: str = "BB84"

    class Config:
        env_file = ".env"

settings = Settings()
