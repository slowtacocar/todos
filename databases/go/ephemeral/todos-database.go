package todos_database

import "strconv"

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
	todos []TodoInput
}

func NewTodosDatabase() TodosDatabase {
	return TodosDatabase{
		todos: make([]TodoInput, 0),
	}
}

func (t TodosDatabase) GetTodos() []Todo {
	response := make([]Todo, len(t.todos))
	for id, doc := range t.todos {
		response[id] = Todo{
			Id:   strconv.Itoa(id),
			Text: *doc.Text,
			Done: *doc.Done,
		}
	}
	return response
}

func (t *TodosDatabase) AddTodo(todo TodoInput) Todo {
	t.todos = append(t.todos, todo)
	return Todo{
		Id:   strconv.Itoa(len(t.todos) - 1),
		Text: *todo.Text,
		Done: *todo.Done,
	}
}

func (t TodosDatabase) UpdateTodo(id string, update TodoInput) {
	index, err := strconv.Atoi(id)
	if err != nil {
		panic(err)
	}
	if update.Text != nil {
		t.todos[index].Text = update.Text
	}
	if update.Done != nil {
		t.todos[index].Done = update.Done
	}
}

func (t *TodosDatabase) DeleteTodo(id string) {
	index, err := strconv.Atoi(id)
	if err != nil {
		panic(err)
	}
	t.todos = append(t.todos[:index], t.todos[index+1:]...)
}
