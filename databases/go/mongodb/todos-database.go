package todos_database

import (
	"context"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type TodoInput struct {
	Text *string `json:"text" bson:"text,omitempty"`
	Done *bool   `json:"done" bson:"done,omitempty"`
}

type Todo struct {
	Id   string `json:"id"`
	Text string `json:"text"`
	Done bool   `json:"done"`
}

type TodosDatabase struct {
	todos *mongo.Collection
}

func NewTodosDatabase() TodosDatabase {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://admin:" + os.Getenv("DB_PASS") + "@localhost"))
	if err != nil {
		panic(err)
	}
	return TodosDatabase{
		todos: client.Database("Todos").Collection("todos"),
	}
}


func (t TodosDatabase) GetTodos() []Todo {
	cursor, err := t.todos.Find(context.TODO(), bson.D{})
	if err != nil {
		panic(err)
	}
	var result []bson.M
	err = cursor.All(context.TODO(), &result)
	if err != nil {
		panic(err)
	}
	response := make([]Todo, len(result))
	for i, doc := range result {
		response[i] = Todo{
			Id: doc["_id"].(primitive.ObjectID).Hex(),
			Text: doc["text"].(string),
			Done: doc["done"].(bool),
		}
	}
	return response
}

func (t TodosDatabase) AddTodo(todo TodoInput) Todo {
	cursor, err := t.todos.InsertOne(context.TODO(), todo)
	if err != nil {
		panic(err)
	}
	return Todo{
		Id: cursor.InsertedID.(primitive.ObjectID).Hex(),
		Text: *todo.Text,
		Done: *todo.Done,
	}
}

func (t TodosDatabase) UpdateTodo(id string, update TodoInput) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		panic(err)
	}
	_, err = t.todos.UpdateOne(
		context.TODO(),
		bson.D{{"_id", objectId}},
		bson.D{{"$set", update}},
	)
	if err != nil {
		panic(err)
	}
}

func (t TodosDatabase) DeleteTodo(id string) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		panic(err)
	}
	_, err = t.todos.DeleteOne(
		context.TODO(),
		bson.D{{"_id", objectId}},
	)
	if err != nil {
		panic(err)
	}
}
