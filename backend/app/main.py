from fastapi import FastAPI
import os
import pymysql

app = FastAPI()


def get_connection():
    return pymysql.connect(
        host=os.getenv("DB_HOST", "db"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "rootpassword"),
        database=os.getenv("DB_NAME", "testdb"),
        cursorclass=pymysql.cursors.DictCursor
    )


@app.on_event("startup")
def init_db():
    conn = get_connection()
    with conn:
        with conn.cursor() as cur:
            cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL
            )
            """)
            cur.execute("SELECT COUNT(*) as cnt FROM users")
            cnt = cur.fetchone()["cnt"]
            if cnt == 0:
                cur.execute("INSERT INTO users (name) VALUES ('Alice'), ('Bob')")
        conn.commit()


@app.get("/users")
def list_users():
    conn = get_connection()
    with conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, name FROM users")
            rows = cur.fetchall()
    return rows


@app.get("/health")
def health():
    try:
        conn = get_connection()
        conn.ping(reconnect=True)
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
