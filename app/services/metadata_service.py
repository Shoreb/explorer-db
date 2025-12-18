from app.db.mysql import get_connection

#Funcion 1 -> retorna la lista de nombres de tablas
def get_tables():
    conn = get_connection()
    cur = conn.cursor()
    query = """
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = DATABASE()

            """
    cur.execute(query)
    tables = [row[0] for row in cur.fetchall()]
    cur.close()
    conn.close()
    return tables

#Funcion 2 -> retorna informacion detallada de las columnas de una tabla especifica
def get_columns(table_name: str):
    conn = get_connection()
    cur = conn.cursor(dictionary=True)

    query = """
        SELECT
            COLUMN_NAME,
            DATA_TYPE,
            IS_NULLABLE,
            COLUMN_KEY
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
        AND table_name = %s
    """

    cur.execute(query, (table_name,))
    result = cur.fetchall()

    columns = []
    for row in result:
        columns.append({
            "column_name": row["COLUMN_NAME"],
            "data_type": row["DATA_TYPE"],
            "is_nullable": row["IS_NULLABLE"],
            "column_key": row["COLUMN_KEY"]
        })

    cur.close()
    conn.close()
    return columns
