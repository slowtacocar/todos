from flask import Flask, request, jsonify
from todos_database import TodosDatabase
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

todos_database = TodosDatabase()


@app.route("/todos", methods=["GET", "POST"])
@cross_origin()
def todos():
    if request.method == "GET":
        return jsonify(todos_database.get_todos())
    else:
        return jsonify(todos_database.add_todo(request.json))


@app.route("/todos/<id>", methods=["PATCH", "DELETE"])
@cross_origin()
def todo(id):
    if request.method == "PATCH":
        todos_database.update_todo(id, request.json)
        return "", 204
    else:
        todos_database.delete_todo(id)
        return "", 204
