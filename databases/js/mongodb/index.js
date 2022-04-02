import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://bobby:vHke9hPS7sblsfrS@todos.ifw5a.mongodb.net/admin?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
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
