package todos_database

import "strconv"

type TodoInput struct {
	text string
	done bool
}

type Todo struct {
	id   string
	text string
	done bool
}

var todos []TodoInput

func GetTodos() []Todo {
	response := make([]Todo, len(todos))
	for id, doc := range todos {
		response[id] = Todo{
			id:   strconv.Itoa(id),
			text: doc.text,
			done: doc.done,
		}
	}
	return response
}

func AddTodo(todo TodoInput) Todo {
	todos = append(todos, todo)
	return Todo{
		id:   strconv.Itoa(len(todos) - 1),
		text: todo.text,
		done: todo.done,
	}
}

func UpdateTodo(id string, update TodoInput) {
	index, _ := strconv.Atoi(id)
	if update.text == "" {
		todos[index].text = update.text
	} else {
		todos[index].done = update.done
	}
}

func DeleteTodo(id string) {
	index, _ := strconv.Atoi(id)
	todos = append(todos[:index], todos[index+1:]...)
}
