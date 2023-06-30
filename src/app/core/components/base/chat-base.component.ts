import { OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';

export abstract class ChatBaseComponent implements OnInit, OnDestroy {
    protected Subscriptions: Subscription[] = [];

    constructor(protected WebSocketService: WebSocketService) { }

    ngOnInit(): void {
        if (this.WebSocketService.isConnected()) {
            this.init();
        }
        else {
            let sub = this.WebSocketService.connected$.subscribe(() => {
                this.init();
            });
            this.Subscriptions.push(sub);
        }
    }

    protected abstract init();

    ngOnDestroy(): void {
        if (this.Subscriptions.length > 0) {
            this.Subscriptions.forEach((item) => {
                item.unsubscribe();
            });
        }
    }
}