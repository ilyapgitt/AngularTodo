import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit{
  @Input() title = 'Error';

  message = '';
  hidden = false;

  constructor(
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.messageService.message$
      .subscribe( text => {
        this.hidden = false;
        this.message = text;
      })
  }
}
