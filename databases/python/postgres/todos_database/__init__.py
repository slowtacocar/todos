import os

import psycopg
from psycopg.rows import dict_row

conn = psycopg.connect(
    f"user=postgres host=localhost dbname=postgres password={os.environ['DB_PASS']} port=5432",
    row_factory=dict_row
)
conn.execute(
    "CREATE TABLE IF NOT EXISTS todos(id SERIAL PRIMARY KEY, text TEXT, done BOOLEAN)"
)


def get_todos():
    return conn.execute("SELECT id, text, done FROM todos").fetchall()


def add_todo(todo):
    return conn.execute("INSERT INTO todos(text, done) VALUES(%(text)s, %(done)s) RETURNING id, text, done", todo).fetchone()


def update_todo(id, update):
    if "text" in update and "done" in update:
        conn.execute("UPDATE todos SET text = %s, done = %s WHERE id = %s", (
            update["text"],
            update["done"],
            id
        ))
    elif "text" in update:
        conn.execute("UPDATE todos SET text = %s WHERE id = %s", (
            update["text"],
            id
        ))
    elif "done" in update:
        conn.execute("UPDATE todos SET done = %s WHERE id = %s", (
            update["done"],
            id
        ))


def delete_todo(id):
    conn.execute("DELETE FROM todos WHERE id = %s", (id,))
