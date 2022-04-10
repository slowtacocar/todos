import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { deleteTodo, updateTodo, Todo } from "todos-client";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-todo",
  template: `
    <div>
      <form
        (ngSubmit)="handleUpdate()"
        [formGroup]="editGroup"
        *ngIf="editing; else check"
      >
        <input formControlName="text" required />
        <button>Update</button>
      </form>
      <ng-template #check>
        <div>
          <input
            [id]="todo.id"
            type="checkbox"
            [checked]="todo.done"
            (change)="handleCheck($event)"
          />
          <label [for]="todo.id">{{ todo.text }}</label>
        </div>
      </ng-template>

      <button type="button" (click)="editing = !editing">
        {{ editing ? "Cancel" : "Edit" }}
      </button>
      <button type="button" (click)="handleDelete()">Delete</button>
    </div>
  `,
  styles: [],
})
export class TodoComponent implements OnChanges {
  @Input() todo: Todo = { id: "" };
  @Output() onChange = new EventEmitter();

  editing = false;
  editGroup = new FormGroup({
    text: new FormControl(this.todo.text),
  });

  ngOnChanges(changes: SimpleChanges) {
    this.editGroup.setValue({ text: this.todo.text });
  }

  handleUpdate() {
    updateTodo(this.todo.id, this.editGroup.value)
      .then(() => this.onChange.emit())
      .catch(() => {
        alert("Failed to update");
      });
    this.editing = false;
  }

  handleCheck(event: Event) {
    updateTodo(this.todo.id, {
      done: (event.target as HTMLInputElement).checked,
    })
      .then(() => this.onChange.emit())
      .catch(() => {
        alert("Failed to check");
      });
  }

  handleDelete() {
    deleteTodo(this.todo.id)
      .then(() => this.onChange.emit())
      .catch(() => {
        alert("Failed to delete");
      });
  }
}
