_todos = []


def get_todos():
    return [{"id": str(id), **doc} for id, doc in enumerate(_todos)]


def add_todo(todo):
    _todos.append(todo)
    return {"id": str(len(_todos) - 1), **todo}


def update_todo(id, update):
    _todos[int(id)].update(update)


def delete_todo(id):
    del _todos[int(id)]
