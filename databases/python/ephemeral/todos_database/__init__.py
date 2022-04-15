class TodosDatabase:
    def __init__(self):
        self._todos = []

    def get_todos(self):
        return [{"id": str(id), **doc} for id, doc in enumerate(self._todos)]

    def add_todo(self, todo):
        self._todos.append(todo)
        return {"id": str(len(self._todos) - 1), **todo}

    def update_todo(self, id, update):
        self._todos[int(id)].update(update)

    def delete_todo(self, id):
        del self._todos[int(id)]
