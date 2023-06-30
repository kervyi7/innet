import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';
import { DataBaseService } from './data-base.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class FileService extends DataBaseService {
    private readonly serviceUrl = '/api/file';

    constructor(http: HttpClient, appConfig: AppConfigService, authService: AuthService) {
        super(http, appConfig, authService);
    }

    protected getHttpHeaders(token: string) {
        return new HttpHeaders({
            'Authorization': 'Bearer' + ' ' + token
        });
    }

    public addAvatar(fileToUpload: any): Observable<any> {
        const input = new FormData();
        input.append("file", fileToUpload);
        return this.Http.post(`${this.BackUrl}${this.serviceUrl}/addavatar`, input, this.options);
    }
}