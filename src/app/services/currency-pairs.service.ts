import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

import { WebSocketService } from '../services/web-socket.service';

@Injectable()
export class CurrencyPairsService {
  private _currencyPairs: BehaviorSubject<Array<Object>> = new BehaviorSubject(Object([]));
  public currencyPairs: Observable<Array<Object>> = this._currencyPairs.asObservable();

  constructor(private webSocketService: WebSocketService) {
    let token = localStorage.getItem('authToken');
    if (token != undefined) {
      this.webSocketService.getData('new values').subscribe(res => {
        this._currencyPairs.next(res);
      });
    }
  }

}
