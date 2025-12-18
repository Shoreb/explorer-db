from fastapi import APIRouter, HTTPException
from app.services.metadata_service import get_tables, get_columns

router = APIRouter(prefix="/metadata", tags=["Metadata"])

@router.get("/tables")
def list_tables():
    try:
        tables = get_tables()
        return {"tables": tables}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/tables/{table_name}/columns")
def list_columns(table_name: str):
    try:
        columns = get_columns(table_name)
        if not columns:
            raise HTTPException(status_code=404, detail="Tabla no encontrada")
        return {"table": table_name, "columns": columns}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))