import { Injectable }    from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { CurrencyPairsService } from '../services/currency-pairs.service';
import { ApiService } from '../services/api.service';
import { AccountService } from '../services/account.service';
import { WebSocketService } from './web-socket.service';

@Injectable()
export class OrdersService {

  private _orders: BehaviorSubject<Array<Object>> = new BehaviorSubject(Object([]));
  private orders;
  private currencyPairs;
  private account;
  private openedOrdersProfit: BehaviorSubject<Object> = new BehaviorSubject(Object);
  private _openedOrdersProfit;
  private subscriber;

  constructor(private currencyPairsService: CurrencyPairsService,
              private apiService: ApiService,
              private accountService: AccountService,
              private webSocketService: WebSocketService) {
  }

  getOrdersProfit() {
    if (!this.orders) {
      this.fillOrders();
    }
    return this.openedOrdersProfit.asObservable();
  }

  getOrders() {
    if (!this.orders) {
      this.fillOrders();
    }
    return this._orders.asObservable();
  }

  fillOrders() {
    if (!this.orders) {
      this.orders = true;
    }
    Promise.all([
      this.apiService.getOpenedOrders(),
      this.getAccount()
    ])
      .then( (res) => {
        this.orders = res[0].results;
        this._orders.next(this.orders);
        this.updateCurrencyPairs();
        this.getWebsocketData();
      });
  }

  updateCurrencyPairs() {
    this.subscriber = this.currencyPairsService.getCurrencyPairs().subscribe(res => {
      this.currencyPairs = res;
      if (res.length === 0)
        return;
      this._openedOrdersProfit = 0;
      this.orders.forEach((order) => {
        order.currency_pair = res.find((currency) => {
          return currency.id === order.currency_pair.id;
        });
        order.end_profit = this.getProfit(order);
        this._openedOrdersProfit += order.end_profit;
      });
      this._orders.next(this.orders);
      this.openedOrdersProfit.next(this._openedOrdersProfit);
    });
  }

  getWebsocketData() {
    let event_name = 'order closed';
    this.webSocketService.getData(event_name).subscribe( (res) => {
      if (res.event != event_name)
        return;
      res = res.res;
      this.deleteOrderFromList(res);
    });
  }

  unsubscribe() {
    this.subscriber && this.subscriber.unsubscribe();
  }

  getProfit(order) {
    let last_value, amount, debt_amount, rest_currency, user_currency, start_value, currency_pair, sub_pair;
    currency_pair = order.currency_pair;
    amount = parseFloat(order.amount);
    start_value = order.start_value;
    last_value = order.end_value || currency_pair.last_value;
    if (order.type === 1) {
      debt_amount = amount * start_value.ask;
      amount -= debt_amount / last_value.bid;
      rest_currency = currency_pair.base_currency.name;
    } else {
      amount *= (start_value.bid - last_value.ask);
      rest_currency = currency_pair.quoted_currency.name;
    }
    user_currency = this.account.currency.name;
    if (rest_currency != user_currency) {
      sub_pair = this.findSubPair(user_currency, rest_currency);
      if (sub_pair.base_currency.name === rest_currency) {
        amount *= sub_pair.last_value.bid;
      } else {
        amount /= sub_pair.last_value.ask;
      }
    }
    return amount;
  }

  findSubPair(currency1, currency2) {
    return this.currencyPairs.find((item) => {
      return item.name.includes(currency1) && item.name.includes(currency2);
    });
  }

  getAccount() {
    this.accountService.getAccount().subscribe( res => this.account = res);
  }

  createOrder(currencyPairId, type, amount) {
    return this.apiService.createOrder(currencyPairId, type, amount)
      .then(order => {
        this.orders.push(order);
        this._orders.next(this.orders);
        this._openedOrdersProfit += this.getProfit(order);
        this.openedOrdersProfit.next(this._openedOrdersProfit);
      });
  }

  deleteOrderFromList(order) {
    this.orders = this.orders.filter( (item) => {return item.id != order.id} );
    this._orders.next(this.orders);
    this._openedOrdersProfit -= this.getProfit(order);
    this.openedOrdersProfit.next(this._openedOrdersProfit);
    this.accountService.updateAccount();
  }

  closeOrder(order) {
    return this.apiService.closeOrder(order.id).then( res => {
      this.deleteOrderFromList(order);
    });
  }
}
