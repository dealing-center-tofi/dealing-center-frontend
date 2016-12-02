import { Injectable }    from '@angular/core';
import { CurrencyPairsService } from '../services/currency-pairs.service';
import { ApiService } from '../services/api.service';
import { AccountService } from '../services/account.service';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable()
export class OrdersService {

  private _orders: BehaviorSubject<Array<Object>> = new BehaviorSubject(Object([]));
  private orders;
  private currencyPairs;
  private account;

  constructor(private currencyPairsService: CurrencyPairsService,
              private apiService: ApiService,
              private accountService: AccountService) {
    let token = localStorage.getItem('authToken');
    if (token != undefined) {
      this.fillOrders();
    }
  }

  fillOrders() {
    Promise.all([
      this.apiService.getOrders(),
      this.getAccount()
    ])
      .then( (res) => {
        this.orders = res[0].results;
        this._orders.next(this.orders);
        this.updateCurrencyPairs();
      });
  }

  updateCurrencyPairs() {
    this.currencyPairsService.currencyPairs.subscribe(res => {
      this.currencyPairs = res;
      if (res.length === 0)
        return;
      this.orders.forEach((order) => {
        order.currency_pair = res.find((currency) => {
          return currency.id === order.currency_pair.id;
        });
        order.profit = order.end_profit || this.getProfit(order);
      });
      this._orders.next(this.orders);
    });
  }

  getProfit(order) {
    let last_value, amount, debt_amount, rest_currency, user_currency, start_value, currency_pair, sub_pair;
    currency_pair = order.currency_pair;
    amount = order.amount;
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

  getOrdersProfit(orders) {
    return orders.reduce( (sum, order) => {
      return sum + (order.status === 1) ? parseFloat(order.profit) : 0;
    }, 0);
  }

  findSubPair(currency1, currency2) {
    return this.currencyPairs.find((item) => {
      return item.name.includes(currency1) && item.name.includes(currency2);
    });
  }

  getAccount() {
    this.accountService.account.subscribe( res => this.account = res);
  }

  createOrder(currencyPairId, type, amount) {
    return this.apiService.createOrder(currencyPairId, type, amount)
      .then(order => {
        this.orders.push(order);
        this._orders.next(this.orders);
      });
  }

  closeOrder(order) {
    return this.apiService.closeOrder(order.id).then( res => {
      this.orders = this.orders.filter( (item) => {return item.id != order.id} );
      this.orders.push(res);
      this._orders.next(this.orders);
      this.accountService.getAccount();
    });
  }

  getOrders() {
    return this._orders.asObservable();
  }
}
