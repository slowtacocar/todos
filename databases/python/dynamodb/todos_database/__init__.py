import uuid

import boto3

dynamodb = boto3.resource("dynamodb", endpoint_url="http://localhost:8000")


class TodosDatabase:
    def __init__(self):
        dynamodb.create_table(
            TableName="todos",
            BillingMode="PAY_PER_REQUEST",
            AttributeDefinitions=[
                {
                    "AttributeName": "id",
                    "AttributeType": "S"
                }
            ],
            KeySchema=[
                {
                    "AttributeName": "id",
                    "KeyType": "HASH"
                }
            ]
        )
        self._todos = dynamodb.Table("todos")

    def get_todos(self):
        res = self._todos.scan()
        return res["Items"]

    def add_todo(self, todo):
        item = {
            "id": str(uuid.uuid4()),
            **todo
        }
        self._todos.put_item(Item=item)
        return item

    def update_todo(self, id, update):
        if "text" in update and "done" in update:
            self._todos.update_item(
                Key={"id": id},
                UpdateExpression="SET #text = :text, done = :done",
                ExpressionAttributeNames={
                    "#text": "text"
                },
                ExpressionAttributeValues={
                    ":text": update["text"],
                    ":done": update["done"],
                }
            )
        elif "text" in update:
            self._todos.update_item(
                Key={"id": id},
                UpdateExpression="SET #text = :text",
                ExpressionAttributeNames={
                    "#text": "text"
                },
                ExpressionAttributeValues={
                    ":text": update["text"]
                }
            )
        elif "done" in update:
            self._todos.update_item(
                Key={"id": id},
                UpdateExpression="SET done = :done",
                ExpressionAttributeValues={
                    ":done": update["done"]
                }
            )

    def delete_todo(self, id):
        self._todos.delete_item(Key={"id": id})
