import { Component, OnInit } from '@angular/core';
import { Todo } from '../../types/todo';
import { TodosService } from '../../services/todos.service';
import { error } from 'console';
import { MessageService } from '../../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, distinctUntilChanged, map, switchMap } from 'rxjs';

const todosFromServer = [
  { id: 1, title: 'HTML + CSS', completed: true },
  { id: 2, title: 'JS', completed: false },
  { id: 3, title: 'React', completed: false },
  { id: 4, title: 'Vue.js', completed: false },
]

@Component({
  selector: 'app-todos-page',
  templateUrl: './todos-page.component.html',
  styleUrl: './todos-page.component.scss'
})
export class TodosPageComponent implements OnInit{
  errorMessage = ''

  todos$ = this.todosService.todos$;
  activeTodos$ = this.todos$.pipe(
    distinctUntilChanged(),
    map(todos => todos.filter(todo => !todo.completed))
  )
  completedTodos$ = this.todos$.pipe(
    map(todos => todos.filter(todo => todo.completed))
  )
  activeCount$ = this.activeTodos$.pipe(
    map(todos => todos.length)
  )
  visibleTodos$ = this.route.params.pipe(
    switchMap(params => {
      switch (params['status']) {
        case 'active':
          return this.activeTodos$;
        case 'completed':
          return this.completedTodos$;
        default:
          return this.todos$;
      }
    })
  )


  trackById(i: number, todo: Todo) {
    return todo.id;
  }


  constructor(
    private todosService: TodosService,
    private messageService: MessageService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.todosService.getTodos()
      .subscribe({
        error: () => this.messageService.showMessage('Unable to load todos'),
      })
  }

  addTodo(newTitle: string) {
    this.todosService.createTodo(newTitle)
      .subscribe({
        error: () => this.errorMessage = 'Unable to add todo'
      })
  }

  toggleTodo(todo: Todo) {
    this.todosService.updateTodo({ ...todo, completed: !todo.completed})
      .subscribe()
  }

  renameTodo(todo: Todo, title: string) {
    this.todosService.updateTodo({ ...todo, title})
      .subscribe({
        error: () => this.errorMessage = 'Unable to update a todo'
  });
  }

  deleteTodo(todo: Todo) {
    this.todosService.deleteTodo(todo)
      .subscribe({
        error: () => this.errorMessage = 'Unable to delete a todo'
      })
  }

  deleteCompletedTodos() {
    this.completedTodos$.subscribe(completedTodos => {
      completedTodos.forEach(todo => {
        this.todosService.deleteTodo(todo)
          .subscribe({
            error: () => this.errorMessage = 'Unable to delete a completed todo'
          })
      })
    })
  }
}
