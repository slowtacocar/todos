import React, { useCallback, useEffect, useState } from "react";
import { addTodo, getTodos } from "todos-client";
import Todo from "./Todo";

export default function App() {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [text, setText] = useState("");

  const mutate = useCallback(() => {
    getTodos().then(setData).catch(setError);
  }, []);

  useEffect(mutate, [mutate]);

  function handleAdd(event) {
    event.preventDefault();

    addTodo({ text, done: false })
      .then(mutate)
      .catch(() => {
        alert("Failed to add");
      });
  }

  if (error) return <p>An error occurred while fetching data</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <>
      <h1>To Do</h1>
      <h2>Remaining Tasks</h2>
      <ul>
        {data.map((todo) => (
          <li key={todo.id}>
            <Todo todo={todo} onChange={mutate} />
          </li>
        ))}
      </ul>
      <h2>New Task</h2>
      <form onSubmit={handleAdd}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          required
        />
        <button>Add</button>
      </form>
    </>
  );
}
