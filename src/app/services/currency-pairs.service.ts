import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

import { WebSocketService } from './web-socket.service';
import { ApiService } from './api.service';

@Injectable()
export class CurrencyPairsService {
  private _currencyPairs: BehaviorSubject<Array<Object>> = new BehaviorSubject(Object([]));
  public currencyPairs: Observable<Array<Object>> = this._currencyPairs.asObservable();

  constructor(private webSocketService: WebSocketService,
              private apiService: ApiService) {
    let token = localStorage.getItem('authToken');
    if (token != undefined) {
      let currencies;
      this.apiService.getCurrencyPairs()
        .then(currencyPairs => {
          currencies = currencyPairs.results.sort( (a, b) =>{ return a.id - b.id });
          this._currencyPairs.next(currencies);
        })
        .then(() => this.getWebsocketData.call(this, currencies));
    }
  }

  getWebsocketData(currencies) {
    this.webSocketService.getData('new values').subscribe(res => {
        res = res.sort( (a, b) => { return a.currency_pair - b.currency_pair });
        for( let i = 0; i < res.length; ++i) {
          currencies[i].isBigger = res[i].bid >= currencies[i].last_value.bid;
          currencies[i].last_value = res[i];
        }

        this._currencyPairs.next(currencies);
      });
  }
}
