from app.db.mysql_dynamic import create_dynamic_connection

def get_tables_dynamic(conn_data):
    conn = create_dynamic_connection(conn_data)
    cur = conn.cursor()

    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
    """)

    tables = [row[0] for row in cur.fetchall()]
    cur.close()
    conn.close()
    return tables

def get_columns_dynamic(conn_data, table_name: str):
    conn = create_dynamic_connection(conn_data)
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT column_name, data_type, is_nullable, column_key
        FROM information_schemas.columns
        WHERE table_schema = DATABASE()
        AND table_name = %s
    """, (table_name))

    columns = cur.fetchall()

    cur.close()
    conn.close()
    return columns