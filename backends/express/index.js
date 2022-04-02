import express from "express";
import cors from "cors";
import { addTodo, deleteTodo, getTodos, updateTodo } from "todos-database";

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get("/todos", async (req, res) => {
  const todos = await getTodos();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const todo = await addTodo(req.body);
  res.json(todo);
});

app.patch("/todos/:id", async (req, res) => {
  await updateTodo(req.params.id, req.body);
  res.end();
});

app.delete("/todos/:id", async (req, res) => {
  await deleteTodo(req.params.id);
  res.end();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
