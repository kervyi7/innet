import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    private _config: any = null;

    constructor(private http: HttpClient) { }

    public getConfig(path: string) {
        const splitPath = path.split('.');
        return this.getConfigValue(splitPath);
    }

    private getConfigValue(path: string[]) {
        let config: any = this._config;
        for (const key of path) {
            config = config[key];
        }
        return config;
    }

    public load() {
        return new Promise((resolve, reject) => {
            this.http.get('app/settings.json').subscribe(
                data => {
                    this._config = data;
                    resolve(true);
                },
                error => {
                    resolve(true);
                    return Observable.throw(error);
                }
            );
        });
    }
}