export interface TodoInput {
  text?: string;
  done?: boolean;
}

export interface Todo {
  id: string;
  text?: string;
  done?: boolean;
}

export function getTodos(): Promise<Todo[]>;
export function addTodo(todo: TodoInput): Promise<Todo>;
export function updateTodo(id: string, update: TodoInput): Promise<void>;
export function deleteTodo(id: string): Promise<void>;
