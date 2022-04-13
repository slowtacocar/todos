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
await client.query(
  q.CreateIndex({
    name: "all_Todos",
    source: q.Collection("Todos"),
  })
);

export async function getTodos() {
  const res = await client.query(
    q.Map(q.Paginate(q.Match(q.Index("all_Todos"))), (ref) => q.Get(ref))
  );
  return res.data.map((doc) => ({ ...doc.data, id: doc.ref.id }));
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
