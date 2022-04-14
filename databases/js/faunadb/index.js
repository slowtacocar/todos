import faunadb from "faunadb";

const q = faunadb.query;
const client = new faunadb.Client({
  secret: "secret",
  domain: "localhost",
  port: 8443,
  scheme: "http",
});

await client.query(
  q.CreateCollection({
    name: "Todos",
  })
);

export async function getTodos() {
  const res = await client.query(
    q.Map(q.Paginate(q.Documents(q.Collection("Todos"))), (ref) =>
      q.Merge({ id: q.Select("id", ref) }, q.Select("data", q.Get(ref)))
    )
  );
  return res.data;
}

export async function addTodo(todo) {
  const res = await client.query(
    q.Create(q.Collection("Todos"), {
      data: todo,
    })
  );
  return { ...res.data, id: res.ref.id };
}

export async function updateTodo(id, update) {
  await client.query(
    q.Update(q.Ref(q.Collection("Todos"), id), {
      data: update,
    })
  );
}

export async function deleteTodo(id) {
  await client.query(q.Delete(q.Ref(q.Collection("Todos"), id)));
}
