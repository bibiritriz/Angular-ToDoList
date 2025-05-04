import { Component, OnInit } from '@angular/core';
import { Todo } from '../todo.model';
import { TodoService } from '../todo.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-to-do-form',
  standalone: false,
  templateUrl: './to-do-form.component.html',
  styleUrl: './to-do-form.component.css',
})
export class ToDoFormComponent implements OnInit {
  submitted: boolean = false;
  id: number = 0;
  formGroupTodo: FormGroup;

  constructor(
    private readonly todoService: TodoService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute
  ) {
    const today = new Date();
    this.formGroupTodo = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      description: [''],
      completed: [false],
      createdAt: [this.resolveDate(today)],
      dueDate: [this.resolveDate(today), this.futureDateValidator],
    });
  }

  ngOnInit(): void {
    const urlId = this.route.snapshot.paramMap.get('id');
    console.log(this.formGroupTodo);
    if (urlId) {
      this.id = parseInt(urlId);
    }

    if (this.id != 0) {
      this.todoService.getTodo(this.id).subscribe({
        next: (todo) => {
          this.formGroupTodo.patchValue({
            title: todo.title,
            description: todo.description,
            completed: todo.completed,
            creatAt: this.resolveDate(todo.createdAt),
            dueDate: this.resolveDate(todo.dueDate),
          });
        },
      });
    }
  }

  resolveDate(data: Date): string {
    data = new Date(data);

    const localDate = new Date(
      data.getTime() + data.getTimezoneOffset() * 60000
    );

    const day = localDate.getDate().toString().padStart(2, '0');
    const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
    const year = localDate.getFullYear();

    const date = `${year}-${month}-${day}`;

    return date;
  }

  saveTodo() {
    this.submitted = true;
    if (this.formGroupTodo.valid) {
      this.submitted = false;
      const todo = this.formGroupTodo.value;
      if (this.id != 0) {
        this.todoService
          .updateTodo({
            ...todo,
            id: this.id,
            completed: todo.completed,
            dueDate: todo.dueDate ? new Date(todo.dueDate) : new Date(),
            createdAt: new Date(todo.createdAt),
          })
          .subscribe();
      } else {
        this.todoService
          .postTodo({
            ...todo,
            dueDate: todo.dueDate ? new Date(todo.dueDate) : new Date(),
            createdAt: new Date(),
          })
          .subscribe();
      }
      this.formGroupTodo.reset({
        dueDate: this.resolveDate(new Date()),
        createdAt: this.resolveDate(new Date()),
      });
    }
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const [year, month, day] = control.value.split('-');
    const dueDate = new Date(Number(year), Number(month) - 1, Number(day));
    const today = new Date();

    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return dueDate.getTime() >= today.getTime() ? null : { notFuture: true };
  }
}
