import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IMessageEvent } from '../models/message-event';
import { filter } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class MessageService{
    private messageEvents = new Subject<IMessageEvent>();

    public publish(messageEvent: IMessageEvent): void {
		this.messageEvents.next(messageEvent);
	}

	public listen(messageEventCode: string): Observable<IMessageEvent> {
		return this.getMessageEvent(messageEventCode);
	}

	private getMessageEvent(messageEventCode: string): Observable<IMessageEvent> {
        return this.messageEvents.asObservable()
        .pipe(filter(messageEvent => messageEvent.code === messageEventCode));
	}
}