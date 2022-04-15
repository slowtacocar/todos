import express from "express";
import cors from "cors";
import newTodosDatabase from "todos-database";

const app = express();
const port = 5000;

const todosDatabase = await newTodosDatabase();

app.use(express.json());
app.use(cors());

app.get("/todos", async (req, res) => {
  const todos = await todosDatabase.getTodos();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const todo = await todosDatabase.addTodo(req.body);
  res.json(todo);
});

app.patch("/todos/:id", async (req, res) => {
  await todosDatabase.updateTodo(req.params.id, req.body);
  res.end();
});

app.delete("/todos/:id", async (req, res) => {
  await todosDatabase.deleteTodo(req.params.id);
  res.end();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
