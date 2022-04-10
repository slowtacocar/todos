<script>
  import Todo from "../components/Todo.svelte";
  import { addTodo, getTodos } from "todos-client";
  
  let promise = getTodos()
  let text = ""
  
  function handleAdd() {
    addTodo({ text, done: false })
      .then(() => promise = getTodos())
      .catch(() => {
        alert("Failed to add");
      });
  }
</script>

{#await promise}
	<p>Loading...</p>
{:then data}
  <h1>To Do</h1>
  <h2>Remaining Tasks</h2>
  <ul>
    {#each data as todo}
      <li>
        <Todo {todo} on:change={() => promise = getTodos()} />
      </li>
    {/each}
  </ul>
  <h2>New Task</h2>
  <form on:submit|preventDefault={handleAdd}>
    <input bind:value={text} required />
    <button>Add</button>
  </form>
{:catch}
  <p>An error occurred while fetching data</p>
{/await}
