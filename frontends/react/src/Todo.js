import React, { useEffect, useState } from "react";
import { deleteTodo, updateTodo } from "todos-client";

export default function Todo({ todo, onChange }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text);

  useEffect(() => {
    setText(todo.text);
  }, [todo.text]);

  function handleUpdate(event) {
    event.preventDefault();

    updateTodo(todo.id, { text })
      .then(onChange)
      .catch(() => {
        alert("Failed to update");
      });
    setEditing(false);
  }

  function handleCheck(event) {
    updateTodo(todo.id, { done: event.target.checked })
      .then(onChange)
      .catch(() => {
        alert("Failed to check");
      });
  }

  function handleDelete() {
    deleteTodo(todo.id)
      .then(onChange)
      .catch(() => {
        alert("Failed to delete");
      });
  }

  return (
    <div>
      {editing ? (
        <form onSubmit={handleUpdate}>
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            required
          />
          <button>Update</button>
        </form>
      ) : (
        <div>
          <input
            id={todo.id}
            type="checkbox"
            checked={todo.done}
            onChange={handleCheck}
          />
          <label htmlFor={todo.id}>{todo.text}</label>
        </div>
      )}
      <button type="button" onClick={() => setEditing((editing) => !editing)}>
        {editing ? "Cancel" : "Edit"}
      </button>
      <button type="button" onClick={handleDelete}>Delete</button>
    </div>
  );
}
