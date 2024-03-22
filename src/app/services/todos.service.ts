import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../types/todo';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';

const BASE_URL = 'https://mate.academy/students-api'
const USER_ID = 12062;

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  refresh$$ = new BehaviorSubject(null);
  todos$: Observable<Todo[]>;

  constructor(
    private http: HttpClient,
  ) {
    this.todos$ = this.refresh$$.pipe(
      switchMap(() => this.getTodos()),
    )
   }

  getTodos() {
    return this.http.get<Todo[]>(`${BASE_URL}/todos?userId=${USER_ID}`)
  }

  createTodo(title: string) {
    return this.http.post<Todo>(`${BASE_URL}/todos`, {
      title,
      userId: USER_ID,
      completed: false,
    })
      .pipe(
        tap(() => this.refresh$$.next(null))
      )
  }

  updateTodo(todo: Todo) {
    return this.http.patch<Todo>(`${BASE_URL}/todos/${todo.id}`, todo)
      .pipe(
        tap(() => this.refresh$$.next(null))
      )
  }

  deleteTodo(todo: Todo) {
    return this.http.delete<Todo>(`${BASE_URL}/todos/${todo.id}`)
      .pipe(
        tap(() => this.refresh$$.next(null))
      )
  }
}
