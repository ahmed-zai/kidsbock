import psycopg2
from config import Config

def get_db_connection():
    conn = psycopg2.connect(Config.DATABASE_URL)
    return conn

def save_child_insight(child_id, insight_type, score, summary):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO child_insights (child_id, insight_type, score, summary)
        VALUES (%s, %s, %s, %s)
        RETURNING id
    """, (child_id, insight_type, score, summary))
    insight_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return insight_id
