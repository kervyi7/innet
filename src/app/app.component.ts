import { Component, OnInit } from '@angular/core';
import { WebSocketService } from './core/services/web-socket.service';
import { IWebSocketEvent } from './core/models/web-socket-event';
import { IMessageEvent } from './core/models/message-event';
import { MessageService } from './core/services/message-service';
import { MessageEventCodes } from './core/enums/message-event-codes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private timeout: any;
  public failedLoad = false;
  public errorMessage: string;

  constructor(private _webSocketService: WebSocketService, private _messageService: MessageService) {
    _webSocketService.listenFor('test').subscribe(event => {
      console.log(event);
    });
  }

  public ngOnInit(): void {
    this._messageService.listen(MessageEventCodes.error).subscribe((message: IMessageEvent) => this.showError(message));
  }

  showError(messageEvent: IMessageEvent) {
    this.errorMessage = messageEvent.data;
    this.failedLoad = true;
    this.timeout = setTimeout(this.closeMessage.bind(this), 10000);
  }

  public closeMessage() {
    this.failedLoad = false;
    clearTimeout(this.timeout);
  }

  public onTest() {
    const event: IWebSocketEvent = { code: 'test', data: 125 }
    this._webSocketService.send('send', null, event);
  }
}

