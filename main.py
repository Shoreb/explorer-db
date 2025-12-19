from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
#
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from app.routers import health, db_test, metadata, metadata_dynamic

app = FastAPI(title="Explorador de Bases de Datos")

app.include_router(health.router)
app.include_router(db_test.router)
app.include_router(metadata.router)
app.include_router(metadata_dynamic.router)

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

@app.get("/")
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/", response_class=HTMLResponse)
def serve_frontend():
    with open("frontend/templates/index.html", "r", encoding="utf-8") as f:
        return f.read()