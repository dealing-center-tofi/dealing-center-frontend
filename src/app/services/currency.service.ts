import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { WebSocketService } from './web-socket.service';

const CHAT_URL = 'ws://localhost:8080/chat';
const config = require('../../../config/api.conf'); 

export interface Message {
    eventName: string;
    data: any;
}

@Injectable()
export class CurrencyService {
    public messages: Subject<any>;

    constructor(wsService: WebSocketService) {

        this.messages = <Subject<Message>>wsService
            .connect(config.currenciesSocketUrl)
            .map((response: MessageEvent): Message => {
                let data = JSON.parse(response.data);
                return this.getEventParams(data);
            });
    }

    getEventParams(data) {
        let eventName = data.splice(0, 1)[0];
            return {
                eventName: eventName,
                data: data
            };
  }
}