#Este codigo crea un pool de conexiones a mysql usando variables de entorno

import os 
import mysql.connector 
from mysql.connector import pooling 
from dotenv import load_dotenv

load_dotenv()

#diccionario de conexion
db_config = {
    "host": os.getenv("MYSQL_HOST"),
    "port": int(os.getenv("MYSQL_PORT")),
    "user": os.getenv("MYSQL_USER"),
    "password": os.getenv("MYSQL_PASSWORD"),
    "database": os.getenv("MYSQL_DATABASE"),
}

try: 
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="explorador_pool",
        pool_size=5,
        **db_config
    )
except mysql.connector.Error as e:
    connection_pool = None
    print(f"Error creando el pool de conexiones: {e}")

def get_connection():
    if connection_pool is None:
        raise Exception("Pool de conexiones no disponible")
    return connection_pool.get_connection()