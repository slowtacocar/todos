import express from "express";
import cors from "cors";
import newTodosDatabase from "todos-database";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Todo {
    id: String!
    text: String
    done: Boolean
  }
  
  input TodoInput {
    text: String
    done: Boolean
  }
  
  type Query {
    getTodos: [Todo!]!
  }
  
  type Mutation {
    addTodo(todo: TodoInput!): Todo
    updateTodo(id: String!, update: TodoInput!): String
    deleteTodo(id: String!): String
  }
`);

const todosDatabase = await newTodosDatabase();

const root = {
  async getTodos() {
    return await todosDatabase.getTodos();
  },
  async addTodo({ todo }) {
    return await todosDatabase.addTodo(todo);
  },
  async updateTodo({ id, update }) {
    await todosDatabase.updateTodo(id, update);
    return id;
  },
  async deleteTodo({ id }) {
    await todosDatabase.deleteTodo(id);
    return id;
  },
};

const app = express();
const port = 5000;

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
