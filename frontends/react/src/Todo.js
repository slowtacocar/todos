import React, { useEffect, useState } from "react";
import { deleteTodo, updateTodo } from "todos-client";

export default function Todo({ todo, onChange }) {
  const [text, setText] = useState(todo.text);

  useEffect(() => {
    setText(todo.text);
  }, [todo.text]);

  function handleUpdate(event) {
    event.preventDefault();

    updateTodo(todo.id, { text }).catch(() => {
      alert("Failed to update");
    });
    onChange();
  }

  function handleDelete() {
    deleteTodo(todo.id).catch(() => {
      alert("Failed to delete");
    });
    onChange();
  }

  return (
    <div>
      <form onSubmit={handleUpdate}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          required
        />
        <button type="submit">Update</button>
      </form>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
