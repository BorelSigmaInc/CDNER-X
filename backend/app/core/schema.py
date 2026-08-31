from sqlalchemy import text
from .database import engine


def ensure_schema() -> None:
    """Additive Postgres/SQLite-safe columns for existing Yosemite databases."""
    statements = [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR DEFAULT 'customer'",
        "ALTER TABLE catalog_offers ADD COLUMN IF NOT EXISTS retail_usd FLOAT DEFAULT 0",
        "ALTER TABLE catalog_offers ADD COLUMN IF NOT EXISTS upgrade_sku VARCHAR",
        "ALTER TABLE catalog_offers ADD COLUMN IF NOT EXISTS family VARCHAR",
        "ALTER TABLE catalog_offers ADD COLUMN IF NOT EXISTS specs VARCHAR",
    ]
    with engine.begin() as conn:
        dialect = engine.dialect.name
        for stmt in statements:
            if dialect == "sqlite":
                stmt = stmt.replace("ADD COLUMN IF NOT EXISTS", "ADD COLUMN")
                try:
                    conn.execute(text(stmt))
                except Exception:
                    pass
            else:
                conn.execute(text(stmt))
