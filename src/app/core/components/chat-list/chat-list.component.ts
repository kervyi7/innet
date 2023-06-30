import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '../../services/web-socket.service';
import { ChatViewModel } from '../../models/view-model/chat/chat-view-model';
import { AppConfigService } from '../../services/app-config.service';
import { ChatBaseComponent } from '../base/chat-base.component';
import { MessageService } from '../../services/message-service';
import { MessageEventCodes } from '../../enums/message-event-codes';
import { X_SELECTED_CHAT_ID_LABEL } from '../../models/common/constants';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent extends ChatBaseComponent implements OnInit {
  public chats: ChatViewModel[] = [];
  public selectedId: number;
  constructor(private _messageService: MessageService, webSocketService: WebSocketService, private _appConfigService: AppConfigService) {
    super(webSocketService)
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.selectedId = +localStorage.getItem(X_SELECTED_CHAT_ID_LABEL);
  }

  protected init() {
    this.WebSocketService.send('GetChats', this.setChats.bind(this));
  }

  public openChat(chat: ChatViewModel) {
    this._messageService.publish({ code: MessageEventCodes.chatChanged, data: chat });
    this.selectedId = chat.id;
    localStorage.setItem(X_SELECTED_CHAT_ID_LABEL, chat.id.toString());
  }

  private setChats(chats: ChatViewModel[]) {
    this.chats = chats;
    if (this.selectedId) {
      const chat = this.chats.find(c => c.id === this.selectedId);
      if (chat) {
        this._messageService.publish({ code: MessageEventCodes.chatChanged, data: chat });
      }
    }
  }

  private convertAvatarUrl(filePatch: string): string {
    const baseUrl = this._appConfigService.getConfig('backUrl');
    return baseUrl + '/' + filePatch;
  }
}