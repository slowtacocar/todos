package todos_database

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/google/uuid"
)

type TodoInput struct {
	Text *string `json:"text"`
	Done *bool   `json:"done"`
}

type Todo struct {
	Id   string `json:"id"`
	Text string `json:"text"`
	Done bool   `json:"done"`
}

type TodosDatabase struct {
	svc *dynamodb.Client
}

func NewTodosDatabase() TodosDatabase {
	cfg, err := config.LoadDefaultConfig(
		context.TODO(),
		config.WithEndpointResolverWithOptions(aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
			return aws.Endpoint{URL: "http://localhost:8000"}, nil
		})),
	)
	if err != nil {
		panic(err)
	}
	svc := dynamodb.NewFromConfig(cfg)
	_, err = svc.CreateTable(context.TODO(), &dynamodb.CreateTableInput{
		TableName: aws.String("todos"),
		BillingMode: types.BillingModePayPerRequest,
		AttributeDefinitions: []types.AttributeDefinition{
			types.AttributeDefinition{
				AttributeName: aws.String("Id"),
				AttributeType: types.ScalarAttributeTypeS,
			},
		},
		KeySchema: []types.KeySchemaElement{
			types.KeySchemaElement{
				AttributeName: aws.String("Id"),
				KeyType: types.KeyTypeHash,
			},
		},
	})
	if err != nil {
		panic(err)
	}
	return TodosDatabase{
		svc: svc,
	}
}

func (t TodosDatabase) GetTodos() []Todo {
	resp, err := t.svc.Scan(context.TODO(), &dynamodb.ScanInput{
		TableName: aws.String("todos"),
	})
	if err != nil {
		panic(err)
	}
	
	var todos []Todo
	err = attributevalue.UnmarshalListOfMaps(resp.Items, &todos)
	if err != nil {
		panic(err)
	}
	return todos
}

func (t TodosDatabase) AddTodo(todo TodoInput) Todo {
	item := Todo{
		Id: uuid.NewString(),
		Text: *todo.Text,
		Done: *todo.Done,
	}

	av, err := attributevalue.MarshalMap(item)
	if err != nil {
		panic(err)
	}

	_, err = t.svc.PutItem(context.TODO(), &dynamodb.PutItemInput{
		TableName: aws.String("todos"),
		Item: av,
	})
	if err != nil {
			panic(err)
	}

	return item
}

func (t TodosDatabase) UpdateTodo(id string, update TodoInput) {
	var builder expression.UpdateBuilder
	if update.Text != nil {
		builder = expression.Set(
			expression.Name("Text"),
			expression.Value(update.Text),
		)
	}
	if update.Done != nil {
		builder = expression.Set(
			expression.Name("Done"),
			expression.Value(update.Done),
		)
	}

	expr, err := expression.NewBuilder().
		WithUpdate(builder).
		Build()
	if err != nil {
		panic(err)
	}

	_, err = t.svc.UpdateItem(context.TODO(), &dynamodb.UpdateItemInput{
		ExpressionAttributeNames: expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		Key: map[string]types.AttributeValue{
			"Id": &types.AttributeValueMemberS{Value: id},
		},
		TableName: aws.String("todos"),
		UpdateExpression: expr.Update(),
	})
	if err != nil {
		panic(err)
	}
}

func (t TodosDatabase) DeleteTodo(id string) {
	_, err := t.svc.DeleteItem(context.TODO(), &dynamodb.DeleteItemInput{
		Key: map[string]types.AttributeValue{
			"Id": &types.AttributeValueMemberS{Value: id},
		},
		TableName: aws.String("todos"),
	})
	if err != nil {
		panic(err)
	}
}
