<script>
  import { deleteTodo, updateTodo } from "todos-client";
  import { createEventDispatcher } from 'svelte';

  export let todo;

  const dispatch = createEventDispatcher();

  let editing = false;
  let text = todo.text
  
  function handleUpdate() {
    updateTodo(todo.id, { text })
      .then(() => dispatch("change"))
      .catch(() => {
        alert("Failed to update");
      });
    editing = false;
  }
  
  function handleCheck(event) {
    updateTodo(todo.id, { done: event.target.checked })
      .then(() => dispatch("change"))
      .catch(() => {
        alert("Failed to check");
      });
  }
  
  function handleDelete() {
    deleteTodo(todo.id)
      .then(() => dispatch("change"))
      .catch(() => {
        alert("Failed to delete");
      });
  }
</script>

<div>
  {#if editing}
    <form on:submit|preventDefault={handleUpdate}>
      <input bind:value={text} required />
      <button>Update</button>
    </form>
  {:else}
    <div>
      <input
        id={todo.id}
        type="checkbox"
        checked={todo.done}
        on:change={handleCheck}
      />
      <label for={todo.id}>{todo.text}</label>
    </div>
  {/if}

  <button type="button" on:click={() => editing = !editing}>
    {editing ? "Cancel" : "Edit"}
  </button>
  <button type="button" on:click={handleDelete}>Delete</button>
</div>
  