import pg from "pg";

const client = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: process.env.DB_PASS,
  port: 5432,
});
await client.connect();
await client.query(
  "CREATE TABLE IF NOT EXISTS todos(id SERIAL PRIMARY KEY, text TEXT, done BOOLEAN)"
);

export async function getTodos() {
  const res = await client.query("SELECT id, text, done FROM todos");
  return res.rows;
}

export async function addTodo(todo) {
  const res = await client.query(
    "INSERT INTO todos(text, done) VALUES($1, $2) RETURNING id, text, done",
    [todo.text, todo.done]
  );
  return res.rows[0];
}

export async function updateTodo(id, update) {
  if (update.text && update.done) {
    await client.query("UPDATE todos SET text = $1, done = $2 WHERE id = $3", [
      update.text,
      update.done,
      id,
    ]);
  } else if (update.text) {
    await client.query("UPDATE todos SET text = $1 WHERE id = $2", [
      update.text,
      id,
    ]);
  } else if (update.done) {
    await client.query("UPDATE todos SET done = $1 WHERE id = $2", [
      update.done,
      id,
    ]);
  }
}

export async function deleteTodo(id) {
  await client.query("DELETE FROM todos WHERE id = $1", [id]);
}
