import {
  addTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from "./node_modules/todos-client/index.js";

const newTask = document.getElementById("newTask");
const todoList = document.getElementById("todoList");

function mutate() {
  getTodos()
    .then((data) => {
      while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
      }
      for (const todo of data) {
        let editing = false;

        const li = document.createElement("li");
        const div = document.createElement("div");
        const input = document.createElement("input");
        input.id = todo.id;
        input.type = "checkbox";
        input.checked = todo.done;
        input.addEventListener("change", (event) => {
          updateTodo(todo.id, { done: event.target.checked })
            .then(mutate)
            .catch(() => {
              alert("Failed to check");
            });
        });
        const label = document.createElement("label");
        label.htmlFor = input.id;
        label.append(todo.text);
        div.append(input, label);
        const form = document.createElement("form");
        const editInput = document.createElement("input");
        editInput.required = true;
        editInput.name = "text";
        editInput.value = todo.text;
        const button = document.createElement("button");
        button.type = "submit";
        button.append("Update");
        form.append(editInput, button);
        form.addEventListener("submit", (event) => {
          event.preventDefault();

          updateTodo(todo.id, { text: event.target.text.value })
            .then(mutate)
            .catch(() => {
              alert("Failed to update");
            });
          li.removeChild(form);
          li.prepend(div);
          edit.removeChild(edit.firstChild);
          edit.append("Edit");
          editing = false;
        });
        const edit = document.createElement("button");
        edit.append("Edit");
        edit.addEventListener("click", () => {
          if (editing) {
            li.removeChild(form);
            li.prepend(div);
            edit.removeChild(edit.firstChild);
            edit.append("Edit");
            editing = false;
          } else {
            li.removeChild(div);
            li.prepend(form);
            edit.removeChild(edit.firstChild);
            edit.append("Cancel");
            editing = true;
          }
        });
        const del = document.createElement("button");
        del.append("Delete");
        del.addEventListener("click", () => {
          deleteTodo(todo.id)
            .then(mutate)
            .catch(() => {
              alert("Failed to delete");
            });
        });
        li.append(div, edit, del);
        todoList.append(li);
      }
    })
    .catch(() => {
      alert("Failed to get data");
    });
}

newTask.addEventListener("submit", (event) => {
  event.preventDefault();

  addTodo({ text: event.target.text.value })
    .then(mutate)
    .catch(() => {
      alert("Failed to add");
    });
});

mutate();
