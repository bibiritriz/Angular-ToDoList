import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Todo} from './todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  apiUrl = 'http://localhost:3000/todos';

  constructor(private readonly http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  getTodo(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  postTodo(todo: Todo): Observable<Todo>{
    return this.http.post<Todo>(this.apiUrl, todo);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateTodo(todo: Todo): Observable<Todo>{
    return this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, todo);
  }
}
