from fastapi import FastAPI

app = FastAPI(title="Explorador de Bases de Datos")

@app.get("/")
def read_root():
    return {"message":"API funcionando correctamente"}

