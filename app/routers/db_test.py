from fastapi import APIRouter, HTTPException
from app.db.mysql import get_connection

#Creacion del router
router = APIRouter(prefix="/db", tags=["Database"])

@router.get("/test-connection")
def test_connection():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT 1")
        cur.fetchone()
        cur.close() #liberar cursor
        conn.close() #devuelve la conexion al pool
        return {"status": "Conexion exitosa a MySQL"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

