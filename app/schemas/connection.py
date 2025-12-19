#Esquema de validacion con pydantic

from pydantic import BaseModel, Field

class DBConnectionSchema(BaseModel):
    user: str = Field(..., min_length=1)
    password: str = Field(..., min_length=0)
    host: str = Field(..., min_length=1)
    port: int = Field(..., gt=0)
    database: str = Field(..., min_length=1)
