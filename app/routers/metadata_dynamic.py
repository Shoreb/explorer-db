from fastapi import APIRouter, HTTPException
from app.schemas.connection import DBConnectionSchema
from app.services.metadata_service import get_columns_dynamic, get_tables_dynamic

router = APIRouter(prefix="/metadata/dynamic", tags=["Metadata Dynamic"])

@router.post("/tables")
def list_tables_dynamic(conn: DBConnectionSchema):
    try:
        tables = get_tables_dynamic(
            conn.user,
            conn.password,
            conn.host,
            conn.port,
            conn.database
        )
        return {"tables": tables}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/tables/{table_name}/columns")
def list_columns_dynamic(
    table_name: str,
    conn: DBConnectionSchema
):
    try:
        columns = get_columns_dynamic(
            conn.user,
            conn.password,
            conn.host,
            conn.port,
            conn.database,
            table_name
        )
        return {"columns": columns}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
