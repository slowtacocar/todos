import os

from pymongo import MongoClient
from bson.objectid import ObjectId

client = MongoClient(f"mongodb://admin:{os.environ['DB_PASS']}@localhost")
todos = client.Todos.todos


def get_todos():
    response = todos.find()
    return [{"id": str(doc["_id"]), "text": doc["text"], "done": doc["done"]} for doc in response]


def add_todo(todo):
    response = todos.insert_one(todo)
    return {"id": str(response.inserted_id), "text": todo["text"], "done": todo["done"]}


def update_todo(id, update):
    todos.update_one({"_id": ObjectId(id)}, {"$set": update})


def delete_todo(id):
    todos.delete_one({"_id": ObjectId(id)})
