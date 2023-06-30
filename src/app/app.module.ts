import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './core/components/sign-in/sign-in.component';
import { MaterialModule } from './core/modules/material.module';
import { SignUpComponent } from './core/components/sign-up/sign-up.component'
import { HttpClientModule } from '@angular/common/http';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AppConfigService } from './core/services/app-config.service';
import { AccountSettingsComponent } from './core/components/account-settings/account-settings.component';
import { UserSettingsComponent } from './core/components/account-settings/user-settings/user-settings.component';
import { MainComponent } from './core/components/main/main.component';
import { GlobalErrorHandlerService } from './core/services/global-error-handler.service';

export function initConfig(config: AppConfigService) {
  return () => config.load();
}

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SignInComponent,
    SignUpComponent,
    AccountSettingsComponent,
    UserSettingsComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ImageCropperModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfigService],
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
