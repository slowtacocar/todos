import uuid

import boto3

dynamodb = boto3.resource("dynamodb", endpoint_url="http://localhost:8000")
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
todos = dynamodb.Table("todos")


def get_todos():
    res = todos.scan()
    return res["Items"]


def add_todo(todo):
    item = {
        "id": str(uuid.uuid4()),
        **todo
    }
    todos.put_item(Item=item)
    return item


def update_todo(id, update):
    if "text" in update and "done" in update:
        todos.update_item(
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
        todos.update_item(
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
        todos.update_item(
            Key={"id": id},
            UpdateExpression="SET done = :done",
            ExpressionAttributeValues={
                ":done": update["done"]
            }
        )


def delete_todo(id):
    todos.delete_item(Key={"id": id})
