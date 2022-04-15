import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(
  `mongodb://admin:${process.env.DB_PASS}@localhost`
);
await client.connect();

export default async function newTodosDatabase() {
  const todos = client.db("Todos").collection("todos");

  return {
    async getTodos() {
      const response = await todos.find().toArray();
      return response.map(({ _id, ...doc }) => ({ id: _id, ...doc }));
    },

    async addTodo(todo) {
      const response = await todos.insertOne(todo);
      return { id: response.insertedId, ...todo };
    },

    async updateTodo(id, update) {
      await todos.updateOne({ _id: new ObjectId(id) }, { $set: update });
    },

    async deleteTodo(id) {
      await todos.deleteOne({ _id: new ObjectId(id) });
    },
  };
}
