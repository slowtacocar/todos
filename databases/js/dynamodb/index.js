import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const dynamodb = new DynamoDBClient({ endpoint: "http://localhost:8000" });
const documentClient = DynamoDBDocumentClient.from(dynamodb);

export default async function newTodosDatabase() {
  await dynamodb.send(
    new CreateTableCommand({
      TableName: "todos",
      BillingMode: "PAY_PER_REQUEST",
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
    })
  );

  return {
    async getTodos() {
      const res = await documentClient.send(
        new ScanCommand({ TableName: "todos" })
      );
      return res.Items;
    },

    async addTodo(todo) {
      const item = {
        id: crypto.randomUUID(),
        ...todo,
      };
      await documentClient.send(
        new PutCommand({
          TableName: "todos",
          Item: item,
        })
      );
      return item;
    },

    async updateTodo(id, update) {
      if (update.text && update.done) {
        await documentClient.send(
          new UpdateCommand({
            TableName: "todos",
            Key: { id },
            UpdateExpression: "SET #text = :text, done = :done",
            ExpressionAttributeNames: {
              "#text": "text",
            },
            ExpressionAttributeValues: {
              ":text": update.text,
              ":done": update.done,
            },
          })
        );
      } else if (update.text) {
        await documentClient.send(
          new UpdateCommand({
            TableName: "todos",
            Key: { id },
            UpdateExpression: "SET #text = :text",
            ExpressionAttributeNames: {
              "#text": "text",
            },
            ExpressionAttributeValues: {
              ":text": update.text,
            },
          })
        );
      } else if (update.done) {
        await documentClient.send(
          new UpdateCommand({
            TableName: "todos",
            Key: { id },
            UpdateExpression: "SET done = :done",
            ExpressionAttributeValues: {
              ":done": update.done,
            },
          })
        );
      }
    },

    async deleteTodo(id) {
      await documentClient.send(
        new DeleteCommand({
          TableName: "todos",
          Key: { id },
        })
      );
    },
  };
}
