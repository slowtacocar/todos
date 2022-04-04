const todos = [];

export async function getTodos() {
  return todos.map((doc, id) => ({ id, ...doc }));
}

export async function addTodo(todo) {
  const id = todos.push(todo) - 1;
  return { id, ...todo };
}

export async function updateTodo(id, update) {
  Object.assign(todos[id], update);
}

export async function deleteTodo(id) {
  todos.splice(id, 1);
}
