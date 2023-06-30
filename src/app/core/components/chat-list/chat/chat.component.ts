import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/core/services/web-socket.service';
import { MessageViewModel } from 'src/app/core/models/view-model/chat/message-view-model';
import { ChatBaseComponent } from '../../base/chat-base.component';
import { EventCodes } from 'src/app/core/enums/event-codes';
import { IWebSocketEvent } from 'src/app/core/models/web-socket-event';
import { MessageService } from 'src/app/core/services/message-service';
import { MessageEventCodes } from 'src/app/core/enums/message-event-codes';
import { ChatViewModel } from 'src/app/core/models/view-model/chat/chat-view-model';
import { IMessageEvent } from 'src/app/core/models/message-event';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent extends ChatBaseComponent implements OnInit {
  public chat: ChatViewModel;
  public newMessage: string;
  public messages: MessageViewModel[] = [];

  constructor(private _messageService: MessageService, webSocketService: WebSocketService) {
    super(webSocketService)
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected init() {
    let sub = this._messageService.listen(MessageEventCodes.chatChanged).subscribe((event: IMessageEvent) => {
      this.messages = [];
      this.chat = event.data;
      if (!this.chat) {
        return;
      }
      this.WebSocketService.send('GetMessageForChat', this.setMessages.bind(this), this.chat.id);
    });
    this.Subscriptions.push(sub);
    sub = this.WebSocketService.listenFor(EventCodes.NewMessage).subscribe((event: IWebSocketEvent) => {
      const message = event.data as MessageViewModel;
      if (this.chat && message && message.chatId === this.chat.id) {
        message.localDate = new Date(message.date);
        this.messages.push(message);
      }
    });
    this.Subscriptions.push(sub);
  }

  private setMessages(messages: MessageViewModel[]) {
    messages.forEach((item) => {
      item.localDate = new Date(item.date + '.000Z');
    });
    this.messages = messages;
  }

  public sendMessage(): void {
    if (!this.chat) {
      return
    }
    const date = new Date();
    let message = new MessageViewModel();
    message.date = this.formatDate(date);
    message.localDate = date;
    message.content = this.newMessage;
    message.guid = this.createGuid();
    message.type = 'Text';
    message.isMy = true;
    message.chatId = this.chat.id;
    this.messages.push(message);
    this.WebSocketService.send('AddMessage', this.addMessage.bind(this), message);
  }

  public addMessage(message: MessageViewModel): void {
    let item = this.messages.find(m => m.guid === message.guid);
    if (item) {
      item.id = message.id;
    }

  }

  private createGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, ((c) => {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }));
  }

  private getDateUtc(date: Date): Date {
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
  }

  private formatDate(date: Date): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
  }

  public textAreaAdjust(o) {
    o.style.height = "1px";
    o.style.height = (100 + o.scrollHeight) + "px";
  }
}
