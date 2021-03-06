import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

import { WebSocketService } from './web-socket.service';
import { ApiService } from './api.service';

@Injectable()
export class CurrencyPairsService {
  private _currencyPairs: BehaviorSubject<Array<Object>> = new BehaviorSubject(Object([]));
  private currencyPairs;
  private alreadySubscribed = false;
  private subscriber;

  constructor(private webSocketService: WebSocketService,
              private apiService: ApiService) {
  }

  getCurrencyPairs() {
    if (!this.currencyPairs) {
      this.makeSubscribe();
    }
    return this._currencyPairs.asObservable();
  }

  makeSubscribe() {
    if (!this.alreadySubscribed) {
      this.alreadySubscribed = true;
      this.subscribeOnWebsocket();
    }
  }

  private subscribeOnWebsocket() {
    this.apiService.getCurrencyPairs()
      .then(currencyPairs => {
        this.currencyPairs = currencyPairs.results.sort( (a, b) =>{ return a.id - b.id });
        this._currencyPairs.next(this.currencyPairs);
      })
      .then(() => this.getWebsocketData.call(this, this.currencyPairs));
  }

  getWebsocketData(currencies) {
    let event_name = 'new values';
    this.subscriber = this.webSocketService.getData(event_name).subscribe((res) => {
        if (res.event != event_name)
          return;
        res = res.res;

        res = res.sort( (a, b) => { return a.currency_pair - b.currency_pair });
        for( let i = 0; i < res.length; ++i) {
          currencies[i].isBigger = res[i].bid >= currencies[i].last_value.bid;
          currencies[i].last_value = res[i];
        }

        this._currencyPairs.next(currencies);
      });
  }

  unsubscribe() {
    this.subscriber && this.subscriber.unsubscribe();
    this.alreadySubscribed = false;
  }
}
