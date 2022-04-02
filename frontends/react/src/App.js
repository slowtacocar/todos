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

    addTodo({ text })
      .then(mutate)
      .catch(() => {
        alert("Failed to add");
      });
  }

  if (error) return <p>An error occurred while fetching data</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <>
      <h2>To Do</h2>
      {data.map((todo) => (
        <Todo key={todo.id} todo={todo} onChange={mutate} />
      ))}
      <form onSubmit={handleAdd}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>
    </>
  );
}
