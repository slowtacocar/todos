# Todos

Modular todo list apps in many web frameworks

## Configuration

The `configurator` folder contains a Node.js script for configuring a frontend, backend, and database.

`cd` into the `configurator` directory and run `yarn start` to run the script. The script should prompt you for a frontend, backend, and database; install everything; and start both the frontend and the backend.

## Frontends

The `frontends` folder contains a subfolder for each frontend framework. Regardless of the framework, each frontend uses Yarn to install packages (including the modular API client).

The frontend can reference a package named `todos-client` that refers to the client module. This can be used to fetch and update todo items from any API; refer to the clients section for info on the available methods.

Each frontend also contains a `metadata.json` with the following properties:

- `"start"`: A command that can run the server to host the frontend (often just `yarn start`)

## Backends

The `backends` folder contains a subfolder for each backend framework. The backends can be in any language and can serve any type of API with a client in the `clients` folder.

The API will need to allow all basic CRUD operations (refer to the client for exact routes and format)

The backend can reference a database. Refer to any of the databases (and their `"installer"` property) for info on how the database works with a backend.

The `metadata.json` contains the following properties:

- `"language"`: The programming language of the backend (changes which database connectors can be used)
- `"client"`: The client used by the frontend to interface with this API (such as REST)
- `"start"`: A command that can run the API server

## Databases

The `databases` folder contains code that the backend can use to access the database.

The database will need to export methods for all basic CRUD operations.

The `metadata.json` contains the following properties:

- `"installer"`: A command that can install the database into a backend. The command is run from the backend directory

## Clients

The `clients` folder contains code that the frontend can use to interface with an API.

The client must contain a `package.json` with a name of `todos-client`

The client should be written as a JavaScript ES module and should export the following methods to access the API:

### `getTodos()`

Fetches a list of todos from the API.

Returns an array of todo objects (`[{ id: string, text: string, done: boolean }]`)

### `addTodo(todo)`

Creates a todo item.

The `todo` parameter is a todo object without an ID: `{ text: string, done: boolean }`

Returns a todo object: `{ id: string, text: string, done: boolean }`

### `updateTodo(id, update)`

Updates an existing todo item.

The `id` parameter is a todo object ID to update. The `update` parameter is an object with properties to update: `{ text?: string, done?: boolean }`

### `deleteTodo(id)`

Deletes a todo item.

The `id` parameter is a todo object ID to delete.

## Themes

The `themes` folder contains a subfolder for each CSS theme. Each theme is structured as an ES module and should contain an `index.css` with the styles.
