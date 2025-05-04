import { Component, OnInit } from '@angular/core';
import { Todo } from '../todo.model';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-to-do-list',
  standalone: false,
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.css',
})
export class ToDoListComponent implements OnInit {
  todos: Todo[] = [];

  constructor(private readonly todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((todo) => (this.todos = todo));
    console.log(new Date());
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        const indice = this.todos.findIndex((t) => t.id === id);
        if (indice > -1) {
          this.todos.splice(indice, 1);
        }
      },
    });
  }

  updateCheck(todo: Todo, event: Event){
    const check = (event.target as HTMLInputElement).checked
    this.todoService
      .updateTodo({ ...todo, completed: check })
      .subscribe();
  }

  resolveDate(data: Date): string {
    data = new Date(data);

    const localDate = new Date(
      data.getTime() + data.getTimezoneOffset() * 60000
    );

    const day = localDate.getDate().toString().padStart(2, '0');
    const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
    const year = localDate.getFullYear();

    const date = `${year}/${month}/${day}`;

    return date;
  }
}
