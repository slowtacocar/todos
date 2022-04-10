<script setup>
import Todo from "./components/Todo.vue";
import { ref, onMounted } from "vue";
import { addTodo, getTodos } from "todos-client";

const data = ref(null);
const error = ref(null);
const text = ref("");

function mutate() {
  getTodos()
    .then((d) => (data.value = d))
    .catch((e) => (error.value = e));
}

function handleAdd() {
  addTodo({ text: text.value, done: false })
    .then(mutate)
    .catch(() => {
      alert("Failed to add");
    });
}

onMounted(mutate);
</script>

<template>
  <p v-if="error">An error occurred while fetching data</p>
  <p v-else-if="!data">Loading...</p>
  <template v-else>
    <h1>To Do</h1>
    <h2>Remaining Tasks</h2>
    <ul>
      <li v-for="todo in data">
        <Todo :todo="todo" @on-change="mutate" />
      </li>
    </ul>
    <h2>New Task</h2>
    <form @submit.prevent="handleAdd">
      <input v-model="text" required />
      <button>Add</button>
    </form>
  </template>
</template>

<style src="todos-theme/index.css"></style> 
