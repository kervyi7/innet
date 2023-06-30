import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatListComponent } from './chat-list.component';

const routes: Routes = [
    {
        path: '',
        component: ChatListComponent
        // children: [
        //     {path: '/:id', component: ChatComponent },
        //     {path: '', component: ChatComponent }
        // ]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatListRoutingModule { }
