import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { AuthService } from './auth.service';

export abstract class DataBaseService {
    protected BackUrl: AppConfigService;
    private _options: { headers: HttpHeaders };

    get options(): { headers: HttpHeaders } {
        if (!this._options) {
            this.setHttpHeaders(this.AuthService.getAuthToken());
        }
        return this._options;
    }

    constructor(
        protected Http: HttpClient,
        private _appConfig: AppConfigService,
        public AuthService: AuthService) {
        this.BackUrl = this._appConfig.getConfig('backUrl');
        this.AuthService.authChanged.subscribe(state => {
            if (state) {
                this.setHttpHeaders(this.AuthService.getAuthToken())
            }
            else {
                this.clearHttpHeaders();
            }
        });
    }

    protected abstract getHttpHeaders(token: string);

    protected setHttpHeaders(token: string) {
        this._options = {
            headers: this.getHttpHeaders(token)
        };
    }

    protected clearHttpHeaders() {
        this._options = {
            headers: this.getHttpHeaders('')
        };
    }
}