from sqlalchemy import text
from .database import engine


def ensure_schema() -> None:
    """Additive Postgres/SQLite-safe columns for existing Yosemite databases."""
    statements = [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR DEFAULT 'customer'",
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
