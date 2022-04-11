import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(`mongodb://admin:${process.env.DB_PASS}@localhost`);
await client.connect();
const todos = client.db("Todos").collection("todos");

export async function getTodos() {
  const response = await todos.find().toArray();
  return response.map(({ _id, ...doc }) => ({ id: _id, ...doc }));
}

export async function addTodo(todo) {
  const response = await todos.insertOne(todo);
  return { id: response.insertedId, ...todo };
}

export async function updateTodo(id, update) {
  await todos.updateOne({ _id: new ObjectId(id) }, { $set: update });
}

export async function deleteTodo(id) {
  await todos.deleteOne({ _id: new ObjectId(id) });
}
