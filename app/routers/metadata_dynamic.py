from fastapi import APIRouter, HTTPException
from app.schemas import MySQLConnectionData
from app.services.metadata_dynamic_service import (
    get_tables_dynamic, 
    get_columns_dynamic
)

router = APIRouter(prefix="/dynamic", tags=["Dynamic Connection"])

@router.post("/tables")
def list_tables_dynamic(data: MySQLConnectionData):
    try:
        tables = get_tables_dynamic(data)
        return {"tables":tables}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/columns")
def list_columns_dynamic(table_name: str, data: MySQLConnectionData):
    try:
        columns = get_columns_dynamic(data, table_name)
        return {"table": table_name, "columns": columns}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
