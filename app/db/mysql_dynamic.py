import mysql.connector
from mysql.connector import Error

def create_dynamic_connection(data):
    try:
        conn = mysql.connector.connect(
            host=data.host,
            port=data.port,
            user=data.user,
            password=data.password,
            database=data.database
        )
        return conn
    except Error as e:
        raise Exception(f"Error de conexion MySQL: {e}" )