const baseUrl = "http://localhost:5000";

export async function getTodos() {
  const response = await fetch(baseUrl + "/todos", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }

  return await response.json();
}

export async function addTodo(todo) {
  const response = await fetch(baseUrl + "/todos", {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }

  return await response.json();
}

export async function updateTodo(id, update) {
  const response = await fetch(baseUrl + `/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(update),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
}

export async function deleteTodo(id) {
  const response = await fetch(baseUrl + `/todos/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
}
