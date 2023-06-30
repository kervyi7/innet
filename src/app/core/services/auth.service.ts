import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { X_AUTH_TOKEN_LABEL } from '../models/common/constants';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public authChanged = new Subject<boolean>();

    public setAuthToken(token: string) {
        localStorage.setItem(X_AUTH_TOKEN_LABEL, token);
        this.authChanged.next(true);
    }

    public getAuthToken(): string {
        return localStorage.getItem(X_AUTH_TOKEN_LABEL);
    }

    public removeAuthToken(): void {
        localStorage.removeItem(X_AUTH_TOKEN_LABEL);
        this.authChanged.next(false);
    }

    public isExistAuthToken(): boolean {
        return localStorage.getItem(X_AUTH_TOKEN_LABEL) != null;
    }
}

