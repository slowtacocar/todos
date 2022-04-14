package todos_database

import (
	"context"
	"os"
	"strconv"

	"github.com/jackc/pgx/v4"
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

var conn, _ = pgx.Connect(context.TODO(), "postgres://postgres:" + os.Getenv("DB_PASS") + "@localhost:5432/postgres")
var _, _ = conn.Exec(context.TODO(), "CREATE TABLE IF NOT EXISTS todos(id SERIAL PRIMARY KEY, text TEXT, done BOOLEAN)")

func GetTodos() []Todo {
	rows, err := conn.Query(context.TODO(), "SELECT id, text, done FROM todos")
	if err != nil {
		panic(err)
	}
	response := make([]Todo, 0)
	for rows.Next() {
		var id int
		var item Todo
		err = rows.Scan(&id, &item.Text, &item.Done)
		if err != nil {
			panic(err)
		}
		item.Id = strconv.Itoa(id)
		response = append(response, item)
	}
	err = rows.Err()
	if err != nil {
		panic(err)
	}
	return response
}

func AddTodo(todo TodoInput) Todo {
	var id int
	var response Todo
	err := conn.QueryRow(context.TODO(), "INSERT INTO todos(text, done) VALUES($1, $2) RETURNING id, text, done", todo.Text, todo.Done).Scan(&id, &response.Text, &response.Done)
	if err != nil {
		panic(err)
	}
	response.Id = strconv.Itoa(id)
	return response
}

func UpdateTodo(id string, update TodoInput) {
	idInt, err := strconv.Atoi(id)
	if err != nil {
		panic(err)
	}
	if update.Text != nil && update.Done != nil {
		_, err = conn.Exec(context.TODO(), "UPDATE todos SET text = $1, done = $2 WHERE id = $3", update.Text, update.Done, idInt)
		if err != nil {
			panic(err)
		}
	} else if update.Text != nil {
		_, err = conn.Exec(context.TODO(), "UPDATE todos SET text = $1 WHERE id = $2", update.Text, idInt)
		if err != nil {
			panic(err)
		}
	} else if update.Done != nil {
		_, err = conn.Exec(context.TODO(), "UPDATE todos SET done = $1 WHERE id = $2", update.Done, idInt)
		if err != nil {
			panic(err)
		}
	}
}

func DeleteTodo(id string) {
	idInt, err := strconv.Atoi(id)
	if err != nil {
		panic(err)
	}
	_, err = conn.Exec(context.TODO(), "DELETE FROM todos WHERE id = $1", idInt)
	if err != nil {
		panic(err)
	}
}
