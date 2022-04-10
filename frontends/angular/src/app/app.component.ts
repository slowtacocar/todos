import { Component, OnInit } from "@angular/core";
import { addTodo, getTodos, Todo } from "todos-client";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-root",
  template: `
    <p *ngIf="error; else el">An error occurred while fetching data</p>
    <ng-template #el>
      <p *ngIf="!data; else main">Loading...</p>
      <ng-template #main>
        <h1>To Do</h1>
        <h2>Remaining Tasks</h2>
        <ul>
          <li *ngFor="let todo of data">
            <app-todo [todo]="todo" (onChange)="mutate()"></app-todo>
          </li>
        </ul>
        <h2>New Task</h2>
        <form (ngSubmit)="handleAdd()" [formGroup]="addGroup">
          <input formControlName="text" required />
          <button>Add</button>
        </form>
      </ng-template>
    </ng-template>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  addGroup = new FormGroup({
    text: new FormControl(""),
  });
  data: Todo[] | null = null;
  error: Error | null = null;

  mutate() {
    getTodos()
      .then((d: Todo[]) => (this.data = d))
      .catch((e: Error) => (this.error = e));
  }

  ngOnInit() {
    this.mutate();
  }

  handleAdd() {
    addTodo({ ...this.addGroup.value, done: false })
      .then(() => this.mutate())
      .catch(() => {
        alert("Failed to add");
      });
  }
}
