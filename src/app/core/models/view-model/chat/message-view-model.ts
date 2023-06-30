import { UserViewModel } from '../user-view-model';

export class MessageViewModel {
    id?: number;
    content: string;
    type: string;
    guid: string;
    sender: UserViewModel;
    date: Date;
    localDate: Date;
    isMy: boolean;
    chatId: number;
    status: string;
}