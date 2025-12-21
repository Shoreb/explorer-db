import pymysql

#Conexion fija
def get_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="TU_PASSWORD",
        database="TU_DATABASE",
        cursorclass=pymysql.cursors.DictCursor
    )

def get_tables():
    connection = get_connection()
    with connection.cursor() as cursor:
        cursor.execute("SHOW TABLES")
        result = cursor.fetchall()
    connection.close()
    return result


def get_columns(table_name: str):
    connection = get_connection()
    with connection.cursor() as cursor:
        cursor.execute(f"DESCRIBE {table_name}")
        result = cursor.fetchall()
    connection.close()
    return result


def get_tables_dynamic(user, password, host, port, database):
    connection = pymysql.connect(
        host=host,
        user=user,
        password=password,
        database=database,
        port=port
    )

    try:
        with connection.cursor() as cursor:
            cursor.execute("SHOW TABLES")
            result = cursor.fetchall()

            # convertir a lista de strings
            tables = [row[0] for row in result]
            return tables

    finally:
        connection.close()

def get_columns_dynamic(user, password, host, port, database, table_name):
    connection = pymysql.connect(
        host=host,
        user=user,
        password=password,
        database=database,
        port=port
    )

    try:
        with connection.cursor() as cursor:
            cursor.execute(f"DESCRIBE `{table_name}`")
            result = cursor.fetchall()

            columns = []
            for row in result:
                columns.append({
                    "name": row[0],       # Field
                    "type": row[1],       # Type
                    "nullable": row[2],   # Null
                    "key": row[3]         # Key
                })

            return columns

    finally:
        connection.close()

