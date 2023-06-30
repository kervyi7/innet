import { CanActivate, Router } from '@angular/router';
import { Observable, } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    constructor(private _router: Router, private _authService: AuthService) { }

    public canActivate(): Observable<boolean> | boolean {
        return Observable.create(observer => {
            if (!this._authService.isExistAuthToken()) {
                observer.next(false);
                observer.complete();
                this._router.navigate(['/signin']);
                return;
            }
            observer.next(true);
            observer.complete();
        });
    }
}
