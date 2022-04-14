use serde::{Deserialize, Serialize};
use mongodb::bson::{doc, Document, oid};
use mongodb::sync::{Client, Database};

#[derive(Deserialize, Serialize)]
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
    db: Database
}

impl TodosDatabase {
    pub fn new() -> TodosDatabase {
        let client = Client::with_uri_str(
            format!("mongodb://admin:{}@localhost", env!("DB_PASS")),
        ).unwrap();
        let db = client.database("Todos");
        TodosDatabase {
            db: db
        }
    }

    pub fn get_todos(&self) -> Vec<Todo> {
        let collection = self.db.collection::<Document>("todos");
        let cursor = collection.find(None, None).unwrap();
        cursor.map(|doc| doc.unwrap()).map(|doc| Todo {
            id: doc.get_object_id("_id").unwrap().to_hex(),
            text: doc.get_str("text").unwrap().to_owned(),
            done: doc.get_bool("done").unwrap(),
        }).collect()
    }

    pub fn add_todo(&self, todo: TodoInput) -> Todo {
        let collection = self.db.collection::<TodoInput>("todos");
        let response = collection.insert_one(&todo, None).unwrap();
        Todo {
            id: response.inserted_id.as_object_id().unwrap().to_hex(),
            text: todo.text.unwrap(),
            done: todo.done.unwrap()
        }
    }

    pub fn update_todo(&self, id: String, update: TodoInput) {
        let collection = self.db.collection::<TodoInput>("todos");
        let object_id = oid::ObjectId::parse_str(id).unwrap();
        let mut set = Document::new();
        if update.text.is_some() {
            set.insert("text", update.text.unwrap());
        }
        if update.done.is_some() {
            set.insert("done", update.done.unwrap());
        }
        collection.update_one(doc! { "_id": object_id }, doc! { "$set": set }, None).unwrap();
    }

    pub fn delete_todo(&self, id: String) {
        let collection = self.db.collection::<Document>("todos");
        let object_id = oid::ObjectId::parse_str(id).unwrap();
        collection.delete_one(doc! { "_id": object_id }, None).unwrap();
    }
}
