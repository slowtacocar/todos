export default async function newTodosDatabase() {
  const todos = [];

  return {
    async getTodos() {
      return todos.map((doc, id) => ({ id, ...doc }));
    },

    async addTodo(todo) {
      const id = todos.push(todo) - 1;
      return { id, ...todo };
    },

    async updateTodo(id, update) {
      Object.assign(todos[id], update);
    },

    async deleteTodo(id) {
      todos.splice(id, 1);
    },
  };
}
