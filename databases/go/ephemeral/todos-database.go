package todos_database

import "strconv"

type TodoInput struct {
	Text string `json:"text"`
	Done bool   `json:"done"`
}

type Todo struct {
	Id   string `json:"id"`
	Text string `json:"text"`
	Done bool   `json:"done"`
}

var todos []TodoInput

func GetTodos() []Todo {
	response := make([]Todo, len(todos))
	for id, doc := range todos {
		response[id] = Todo{
			Id:   strconv.Itoa(id),
			Text: doc.Text,
			Done: doc.Done,
		}
	}
	return response
}

func AddTodo(todo TodoInput) Todo {
	todos = append(todos, todo)
	return Todo{
		Id:   strconv.Itoa(len(todos) - 1),
		Text: todo.Text,
		Done: todo.Done,
	}
}

func UpdateTodo(id string, update TodoInput) {
	index, _ := strconv.Atoi(id)
	if update.Text != "" {
		todos[index].Text = update.Text
	} else {
		todos[index].Done = update.Done
	}
}

func DeleteTodo(id string) {
	index, _ := strconv.Atoi(id)
	todos = append(todos[:index], todos[index+1:]...)
}
