import { Injectable, ErrorHandler, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandlerService extends ErrorHandler {

    constructor(private _ngZone: NgZone, private _router: Router) {
		super();
    }
    
    public handleError(error: Error): void {
        if(this.isHttpError(error)){
            const httpErrorResponse = error as HttpErrorResponse;
            if(httpErrorResponse.status === 401){
                this._ngZone.run(() => this._router.navigate(['/signin']));
            }
        }
		super.handleError(error);
    }
    
    private isHttpError(error: Error): boolean {
		return error instanceof HttpErrorResponse;
	}
}