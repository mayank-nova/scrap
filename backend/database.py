from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# scrap.db lives next to this file, so it's the same no matter where you launch the server from.
SQLALCHEMY_DATABASE_URL = f"sqlite:///{Path(__file__).resolve().parent / 'scrap.db'}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# Dependency to safely open and close DB connections
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
