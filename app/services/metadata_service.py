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
                column_name,
                data_type,
                is_nullable,
                column_key
            FROM information_schema.columns
            WHERE table_schema = DATABASE()
            AND table_name = %s

            """
    cur.execute(query, (table_name,))
    columns = cur.fetchall()
    cur.close()
    conn.close()
    return columns