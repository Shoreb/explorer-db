from fastapi import FastAPI
from app.routers import health

app = FastAPI(title="Explorador de Bases de Datos")

app.include_router(health.router)