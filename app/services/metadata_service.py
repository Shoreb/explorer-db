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
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            port=port,
            cursorclass=pymysql.cursors.DictCursor
        )

        with connection.cursor() as cursor:
            cursor.execute("SHOW TABLES")
            result = cursor.fetchall()

        connection.close()
        return result

    except pymysql.err.OperationalError:
        raise Exception("Error de conexión con MySQL")


def get_columns_dynamic(user, password, host, port, database, table):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            port=port,
            cursorclass=pymysql.cursors.DictCursor
        )

        with connection.cursor() as cursor:
            query = """
            SELECT COLUMN_NAME, DATA_TYPE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = %s
            AND TABLE_NAME = %s
            """
            cursor.execute(query, (database, table))
            result = cursor.fetchall()

        connection.close()

        if not result:
            raise Exception("La tabla no existe o no tiene columnas")

        return result

    except pymysql.err.OperationalError as e:
        raise Exception("Error de conexión con MySQL")
