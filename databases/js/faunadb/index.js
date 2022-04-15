import faunadb from "faunadb";

const q = faunadb.query;
const client = new faunadb.Client({
  secret: "secret",
  domain: "localhost",
  port: 8443,
  scheme: "http",
});

export default async function newTodosDatabase() {
  await client.query(
    q.CreateCollection({
      name: "Todos",
    })
  );

  return {
    async getTodos() {
      const res = await client.query(
        q.Map(q.Paginate(q.Documents(q.Collection("Todos"))), (ref) =>
          q.Merge({ id: q.Select("id", ref) }, q.Select("data", q.Get(ref)))
        )
      );
      return res.data;
    },

    async addTodo(todo) {
      const res = await client.query(
        q.Create(q.Collection("Todos"), {
          data: todo,
        })
      );
      return { ...res.data, id: res.ref.id };
    },

    async updateTodo(id, update) {
      await client.query(
        q.Update(q.Ref(q.Collection("Todos"), id), {
          data: update,
        })
      );
    },

    async deleteTodo(id) {
      await client.query(q.Delete(q.Ref(q.Collection("Todos"), id)));
    },
  };
}
