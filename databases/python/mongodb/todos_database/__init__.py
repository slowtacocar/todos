import os

from pymongo import MongoClient
from bson.objectid import ObjectId

client = MongoClient(f"mongodb://admin:{os.environ['DB_PASS']}@localhost")


class TodosDatabase:
    def __init__(self):
        self._todos = client.Todos.todos

    def get_todos(self):
        response = self._todos.find()
        return [{"id": str(doc["_id"]), "text": doc["text"], "done": doc["done"]} for doc in response]

    def add_todo(self, todo):
        response = self._todos.insert_one(todo)
        return {"id": str(response.inserted_id), "text": todo["text"], "done": todo["done"]}

    def update_todo(self, id, update):
        self._todos.update_one({"_id": ObjectId(id)}, {"$set": update})

    def delete_todo(self, id):
        self._todos.delete_one({"_id": ObjectId(id)})
