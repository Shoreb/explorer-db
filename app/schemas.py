from pydantic import BaseModel

class MySQLConnectionData(BaseModel):
    host: str
    port: int = 3306
    user: str
    password: str
    database: str