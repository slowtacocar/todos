#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;

use rocket_contrib::json::Json;
use rocket::State;
use todos_database::{Todo, TodoInput, TodosDatabase};
use rocket_cors::{CorsOptions};

#[get("/todos")]
fn get_todos(database: State<TodosDatabase>) -> Json<Vec<Todo>> {
    Json(database.get_todos())
}

#[post("/todos", data = "<todo>")]
fn add_todo(todo: Json<TodoInput>, database: State<TodosDatabase>) -> Json<Todo> {
    Json(database.add_todo(todo.into_inner()))
}

#[patch("/todos/<id>", data = "<update>")]
fn update_todo(id: String, update: Json<TodoInput>, database: State<TodosDatabase>) {
    database.update_todo(id, update.into_inner());
}

#[delete("/todos/<id>")]
fn delete_todo(id: String, database: State<TodosDatabase>) {
    database.delete_todo(id);
}

fn main() {
    let cors = CorsOptions::default();

    rocket::ignite()
        .attach(cors.to_cors().unwrap())
        .manage(TodosDatabase::new())
        .mount("/", routes![get_todos, add_todo, update_todo, delete_todo])
        .launch();
}
