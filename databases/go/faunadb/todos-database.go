package todos_database

import f "github.com/fauna/faunadb-go/v4/faunadb"

type TodoInput struct {
	Text *string `json:"text" fauna:"text,omitempty"`
	Done *bool   `json:"done" fauna:"done,omitempty"`
}

type Todo struct {
	Id   string `json:"id" fauna:"id"`
	Text string `json:"text" fauna:"text"`
	Done bool   `json:"done" fauna:"done"`
}

var client = f.NewFaunaClient(
	"secret",
	f.Endpoint("http://localhost:8443/"),
)

var _, _ = client.Query(
	f.CreateCollection(f.Obj{
		"name": "Todos",
	}),
)

func GetTodos() []Todo {
	res, err := client.Query(
		f.Map(
			f.Paginate(f.Documents(f.Collection("Todos"))),
			f.Lambda(
				"ref",
				f.Merge(
					f.Obj{ "id": f.Select("id", f.Var("ref")) },
					f.Select("data", f.Get(f.Var("ref"))),
				),
			),
		),
	)
	if err != nil {
		panic(err)
	}
 
	var data []Todo
	err = res.At(f.ObjKey("data")).Get(&data)
	if err != nil {
		panic(err)
	}

	return data
}

func AddTodo(todo TodoInput) Todo {
	res, err := client.Query(
		f.Create(f.Collection("Todos"), f.Obj{
			"data": todo,
		}),
	)
	if err != nil {
		panic(err)
	}

	var data TodoInput
	err = res.At(f.ObjKey("data")).Get(&data)
	if err != nil {
		panic(err)
	}
	var ref f.RefV
	err = res.At(f.ObjKey("ref")).Get(&ref)
	if err != nil {
		panic(err)
	}

	return Todo{
		Id: ref.ID,
		Text: *data.Text,
		Done: *data.Done,
	}
}

func UpdateTodo(id string, update TodoInput) {
	_, err := client.Query(
		f.Update(f.Ref(f.Collection("Todos"), id), f.Obj{
			"data": update,
		}),
	)
	if err != nil {
		panic(err)
	}
}

func DeleteTodo(id string) {
	_, err := client.Query(f.Delete(f.Ref(f.Collection("Todos"), id)))
	if err != nil {
		panic(err)
	}
}
