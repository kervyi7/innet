import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './core/components/sign-in/sign-in.component';
import { MainComponent } from './core/components/main/main.component';
import { AuthGuardService } from './core/services/auth-guard.service';
import { SignUpComponent } from './core/components/sign-up/sign-up.component';
import { AccountSettingsComponent } from './core/components/account-settings/account-settings.component';
import { UserSettingsComponent } from './core/components/account-settings/user-settings/user-settings.component';
import { ChatListModule } from './core/components/chat-list/chat-list.module';


const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: "", redirectTo: "settings", pathMatch: "full" },
      { path: "settings", component: AccountSettingsComponent },
      { path: "usersettings", component: UserSettingsComponent },
      {
        path: "chat",
        loadChildren: (): Promise<ChatListModule> =>
          import('./core/components/chat-list/chat-list.module').then(m => m.ChatListModule)
      }
    ]
  },
  {
    path: "signin",
    component: SignInComponent
  },
  {
    path: "signup",
    component: SignUpComponent
  },
  {
    path: "signup/:nick",
    component: SignUpComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
