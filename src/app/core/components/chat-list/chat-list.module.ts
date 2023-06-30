import { NgModule } from '@angular/core';

import { ChatComponent } from './chat/chat.component';
import { ChatListRoutingModule } from './chat-list-routing.module'
import { ChatListComponent } from './chat-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ChatComponent, 
        ChatListComponent
    ],
    imports: [
        ChatListRoutingModule, CommonModule, FormsModule
    ]
})
export class ChatListModule { }
