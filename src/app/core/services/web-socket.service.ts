import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { HttpTransportType, HubConnectionState } from '@aspnet/signalr';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IWebSocketEvent } from '../models/web-socket-event';
import { AppConfigService } from './app-config.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    private readonly intervalHubReconnectConfigName = 'intervalHubReconnect';
    private readonly backUrlConfigName = 'backUrl';
    private readonly hubPathConfigName = '/chathub';
    private _hubConnection: signalR.HubConnection;
    private _reconnectInterval: any;
    private _onEvent$ = new Subject<IWebSocketEvent>();
    public connected$ = new Subject();
    public disconnected$ = new Subject();

    constructor(private _appConfig: AppConfigService,private _authService: AuthService) {
        if(this._authService.isExistAuthToken()){
            this.start();
        }
        this._authService.authChanged.subscribe(state => {
            if (state) {
                this.start();
            }
            else {
                this.stop();
            }
        });
    }

    public isConnected(): boolean{
        return this._hubConnection && this._hubConnection.state === HubConnectionState.Connected;
    }

    private start() {
        if (!this.isHubConnectionExist()) {
            this.createConnection();
        }
        if (this._hubConnection.state === HubConnectionState.Connected) {
            return;
        }
        this._hubConnection
            .start()
            .then(() => {
                this.connected$.next();
                this.stopReconnect();
                console.log('Connection started')
            })
            .catch(err => {
                this.startReconnect();
                console.log('Error while starting connection: ' + err)})
    }

    public stop(): void {
        if (!this._hubConnection) {
            return;
        }
        this._hubConnection.stop();
        this._hubConnection = null;
        this.stopReconnect();
    }

    public send(action: string, callback?: Function, ...arg: any[]): void {
		if (this._hubConnection.state === HubConnectionState.Disconnected) {
			return;
		}
		this._hubConnection.invoke(action, ...arg).then(data => {
			if (callback) {
				callback(data);
			}
		}).catch(error => {
            debugger
			console.log(error);
		});
    }

    public listenFor(eventCode: string): Observable<IWebSocketEvent> {
		return this._onEvent$.asObservable().pipe(filter(event => event.code === eventCode));
	}
    
    private createConnection() {
        this._hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this._appConfig.getConfig(this.backUrlConfigName) + this.hubPathConfigName,
                { 
                    transport: HttpTransportType.WebSockets,
                    accessTokenFactory: this._authService.getAuthToken
                 })
            .build();
        this._hubConnection.onclose(() => {
            console.log('onclose');
            this.disconnected$.next();
            this.startReconnect();
        });
        this._hubConnection.on("send", (data: IWebSocketEvent) => {
            this._onEvent$.next(data);
        })
    }

    private startReconnect(): void {
        if (this._reconnectInterval) {
            return;
        }
        const interval = this._appConfig.getConfig(this.intervalHubReconnectConfigName);
        this._reconnectInterval = setInterval(() => {
            this.start();
        }, interval);
    }

    private stopReconnect(): void {
        if (this._reconnectInterval) {
            clearInterval(this._reconnectInterval);
            this._reconnectInterval = null;
        }
    }

    private isHubConnectionExist(): boolean {
		return this._hubConnection !== null && this._hubConnection !== undefined;
	}
}
