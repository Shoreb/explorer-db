from fastapi import FastAPI
from app.routers import health, db_test, metadata

app = FastAPI(title="Explorador de Bases de Datos")

app.include_router(health.router)
app.include_router(db_test.router)
app.include_router(metadata.router)