from faunadb import query as q
from faunadb.objects import Ref
from faunadb.client import FaunaClient

client = FaunaClient(
    secret="secret",
    domain="localhost",
    port=8443,
    scheme="http"
)
client.query(
    q.create_collection({
        "name": "Todos"
    })
)


def get_todos():
    res = client.query(
        q.map_(
            lambda ref: q.merge(
                {"id": q.select("id", ref)},
                q.select("data", q.get(ref))
            ),
            q.paginate(q.documents(q.collection("Todos")))
        )
    )
    return res["data"]


def add_todo(todo):
    res = client.query(
        q.create(q.collection("Todos"), {
            "data": todo
        })
    )
    return {
        "id": res["ref"].id(),
        **res["data"]
    }


def update_todo(id, update):
    client.query(
        q.update(q.ref(q.collection("Todos"), id), {
            "data": update
        })
    )


def delete_todo(id):
    client.query(q.delete(q.ref(q.collection("Todos"), id)))
