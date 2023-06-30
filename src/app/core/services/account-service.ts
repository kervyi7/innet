import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { ILoginViewModel } from '../models/view-model/login-view-model';
import { TokenViewModel } from '../models/view-model/token-view-model';
import { Observable } from 'rxjs';
import { UserViewModel } from '../models/view-model/user-view-model';
import { RegisterUserViewModel } from '../models/view-model/register-user-view-model';
import { ConfirmViewModel } from '../models/view-model/confirm-view-model';
import { DataBaseService } from './data-base.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AccountService extends DataBaseService {
    private readonly serviceUrl = '/api/account';
    
    constructor(
        http: HttpClient,
        appConfig: AppConfigService,
        authService: AuthService) {
        super(http, appConfig, authService);
    }

    protected getHttpHeaders(token: string) {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer' + ' ' + token
        });
    }

    public getToken(body: ILoginViewModel): Observable<TokenViewModel> {
        return this.Http.post(`${this.BackUrl}${this.serviceUrl}/token`, body, this.options) as Observable<TokenViewModel>;
    }

    public getUser(): Observable<UserViewModel> {
        return this.Http.get(`${this.BackUrl}${this.serviceUrl}/getuser`, this.options) as Observable<UserViewModel>;
    }

    public editUser(body: UserViewModel): Observable<UserViewModel> {
        return this.Http.put(`${this.BackUrl}${this.serviceUrl}/edituser`, body, this.options) as Observable<UserViewModel>;
    }

    public registerUser(body: RegisterUserViewModel): Observable<any> {
        return this.Http.post(`${this.BackUrl}${this.serviceUrl}/register`, body, this.options);
    }

    public confirmEmail(body: ConfirmViewModel): Observable<TokenViewModel> {
        return this.Http.post(`${this.BackUrl}${this.serviceUrl}/confirm`, body, this.options) as Observable<TokenViewModel>;
    }
}