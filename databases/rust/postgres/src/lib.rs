use serde::{Deserialize, Serialize};
use postgres::{Client, NoTls};
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
    client: Mutex<Client>
}

impl TodosDatabase {
    pub fn new() -> TodosDatabase {
        let mut client = Client::connect(format!("host=localhost user=postgres dbname=postgres password={} port=5432", env!("DB_PASS")).as_str(), NoTls).unwrap();
        client.execute("CREATE TABLE IF NOT EXISTS todos(id SERIAL PRIMARY KEY, text TEXT, done BOOLEAN)", &[]).unwrap();
        TodosDatabase {
            client: Mutex::new(client)
        }
    }

    pub fn get_todos(&self) -> Vec<Todo> {
        self.client.lock().unwrap().query("SELECT id, text, done FROM todos", &[]).unwrap().iter().map(|row| Todo {
            id: row.get::<&str, i32>("id").to_string(),
            text: row.get("text"),
            done: row.get("done")
        }).collect()
    }

    pub fn add_todo(&self, todo: TodoInput) -> Todo {
        let res = self.client.lock().unwrap().query_one(
            "INSERT INTO todos(text, done) VALUES($1, $2) RETURNING id, text, done",
            &[&todo.text.unwrap(), &todo.done.unwrap()]
        ).unwrap();
        return Todo {
            id: res.get::<&str, i32>("id").to_string(),
            text: res.get("text"),
            done: res.get("done")
        }
    }

    pub fn update_todo(&self, id: String, update: TodoInput) {
        if update.text.is_some() && update.done.is_some() {
            self.client.lock().unwrap().execute("UPDATE todos SET text = $1, done = $2 WHERE id = $3", &[
                &update.text.unwrap(),
                &update.done.unwrap(),
                &id.parse::<i32>().unwrap()
            ]).unwrap();
        } else if update.text.is_some() {
            self.client.lock().unwrap().execute("UPDATE todos SET text = $1 WHERE id = $2", &[
                &update.text.unwrap(),
                &id.parse::<i32>().unwrap()
            ]).unwrap();
        } else if update.done.is_some() {
            self.client.lock().unwrap().execute("UPDATE todos SET done = $1 WHERE id = $2", &[
                &update.done.unwrap(),
                &id.parse::<i32>().unwrap()
            ]).unwrap();
        }
    }

    pub fn delete_todo(&self, id: String) {
        self.client.lock().unwrap().execute("DELETE FROM todos WHERE id = $1", &[&id.parse::<i32>().unwrap()]).unwrap();
    }
}
