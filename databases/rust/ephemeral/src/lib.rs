use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[derive(Deserialize)]
pub struct TodoInput {
    text: Option<String>,
    done: Option<bool>
}

#[derive(Serialize)]
pub struct Todo {
    id: String,
    text: String,
    done: bool
}

pub struct TodosDatabase {
    todos: Mutex<Vec<TodoInput>>
}

impl TodosDatabase {
    pub fn new() -> TodosDatabase {
        TodosDatabase {
            todos: Mutex::new(Vec::new())
        }
    }

    pub fn get_todos(&self) -> Vec<Todo> {
        self.todos.lock().unwrap().iter().enumerate().map(|(id, todo)| Todo {
            id: id.to_string(),
            text: todo.text.clone().unwrap(),
            done: todo.done.unwrap()
        }).collect()
    }

    pub fn add_todo(&self, todo: TodoInput) -> Todo {
        let ret = Todo {
            id: self.todos.lock().unwrap().len().to_string(),
            text: todo.text.clone().unwrap(),
            done: todo.done.unwrap()
        };
        self.todos.lock().unwrap().push(todo);
        ret
    }

    pub fn update_todo(&self, id: String, update: TodoInput) {
        if !update.text.is_none() {
            self.todos.lock().unwrap().get_mut(id.parse::<usize>().unwrap()).unwrap().text = update.text;
        }
        if !update.done.is_none() {
            self.todos.lock().unwrap().get_mut(id.parse::<usize>().unwrap()).unwrap().done = update.done;
        }
    }

    pub fn delete_todo(&self, id: String) {
        self.todos.lock().unwrap().remove(id.parse::<usize>().unwrap());
    }
}
