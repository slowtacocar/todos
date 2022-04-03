const baseUrl = "http://localhost:5000/graphql";

export async function getTodos() {
  const query = `
    query {
      getTodos {
        id
        text
        done
      }
    }
  `;

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }

  const json = await response.json();
  return json.data.getTodos;
}

export async function addTodo(todo) {
  const query = `
    mutation ($todo: TodoInput!) {
      addTodo(todo: $todo) {
        id
        text
        done
      }
    }
  `;

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables: { todo } }),
  });

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }

  const json = await response.json();
  return json.data.addTodo;
}

export async function updateTodo(id, update) {
  const query = `
    mutation ($id: String!, $update: TodoInput!) {
      updateTodo(id: $id, update: $update)
    }
  `;

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables: { id, update } }),
  });

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
}

export async function deleteTodo(id) {
  const query = `
    mutation ($id: String!) {
      deleteTodo(id: $id)
    }
  `;

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables: { id } }),
  });

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
}
