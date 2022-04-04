from flask import Flask, request, jsonify
from todos_database import get_todos, add_todo, update_todo, delete_todo
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)


@app.route("/todos", methods=["GET", "POST"])
@cross_origin()
def todos():
    if request.method == "GET":
        return jsonify(get_todos())
    else:
        return jsonify(add_todo(request.json))


@app.route("/todos/<id>", methods=["PATCH", "DELETE"])
@cross_origin()
def todo(id):
    if request.method == "PATCH":
        update_todo(id, request.json)
        return "", 204
    else:
        delete_todo(id)
        return "", 204
