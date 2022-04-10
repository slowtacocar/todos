<script setup>
import { deleteTodo, updateTodo } from "todos-client";
import { ref } from "vue";

const props = defineProps(["todo"]);
const emit = defineEmits(["onChange"]);
const editing = ref(false);
const text = ref(props.todo.text);

function handleUpdate() {
  updateTodo(props.todo.id, { text: text.value })
    .then(() => emit("onChange"))
    .catch(() => {
      alert("Failed to update");
    });
  editing.value = false;
}

function handleCheck(event) {
  updateTodo(props.todo.id, { done: event.target.checked })
    .then(() => emit("onChange"))
    .catch(() => {
      alert("Failed to check");
    });
}

function handleDelete() {
  deleteTodo(props.todo.id)
    .then(() => emit("onChange"))
    .catch(() => {
      alert("Failed to delete");
    });
}
</script>

<template>
  <div>
    <form @submit.prevent="handleUpdate" v-if="editing">
      <input v-model="text" required />
      <button>Update</button>
    </form>
    <div v-else>
      <input
        :id="todo.id"
        type="checkbox"
        :checked="todo.done"
        @change="handleCheck"
      />
      <label :for="todo.id">{{ todo.text }}</label>
    </div>

    <button type="button" @click="editing = !editing">
      {{ editing ? "Cancel" : "Edit" }}
    </button>
    <button type="button" @click="handleDelete">Delete</button>
  </div>
</template>
