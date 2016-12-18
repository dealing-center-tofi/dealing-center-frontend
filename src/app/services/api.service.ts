import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

const config = require('../../../config/api.conf');

@Injectable()
export class ApiService {

  private headers;
  private currenciesUrl = config.apiUrl + '/api/currencies/';
  private currencyPairsUrl = config.apiUrl + '/api/currency_pairs/';
  private ordersUrl = config.apiUrl + '/api/orders/';
  private openedOrdersUrl = config.apiUrl + '/api/orders/?page_size=all&status=1';
  private closedOrdersUrl = config.apiUrl + '/api/orders/?page_size=all&status=2';
  private ordersUrlAll = this.ordersUrl + '?page_size=all';
  private userInfoUrl = config.apiUrl + '/api/users/me/';
  private accountUrl = config.apiUrl + '/api/account/me/';
  private transfersUrl = config.apiUrl + '/api/transfers/';
  private historyValuesUrl = config.apiUrl + '/api/history/';

  constructor(private http: Http) {}

  getToken() {
    return localStorage.getItem('authToken');
  }

  setHeaders() {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.getToken()}`,
    });
  }

  getUserInfo(): Promise<any> {
    this.setHeaders();
    return this.http.get(this.userInfoUrl, {headers: this.headers})
              .toPromise()
              .then(response => response.json())
              .catch(this.handleError);
  }

  getAccount(): Promise<any> {
   this.setHeaders();
    return this.http.get(this.accountUrl, {headers: this.headers})
              .toPromise()
              .then(response => response.json())
              .catch(this.handleError);
  }

  getCurrencies(): Promise<any> {
    return this.http.get(this.currenciesUrl)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getCurrencyPairs(): Promise<any> {
    this.setHeaders();
    return this.http.get(this.currencyPairsUrl, {headers: this.headers})
              .toPromise()
              .then(response => response.json())
              .catch(this.handleError);
  }

  getOrders(): Promise<any> {
    this.setHeaders();
    return this.http.get(this.ordersUrlAll, {headers: this.headers})
              .toPromise()
              .then(response => response.json())
              .catch(this.handleError);
  }

  getOpenedOrders(): Promise<any> {
    this.setHeaders();
    return this.http.get(this.openedOrdersUrl, {headers: this.headers})
              .toPromise()
              .then(response => response.json())
              .catch(this.handleError)
  }

  getAllClosedOrders(): Promise<any> {
    this.setHeaders();
    return this.http.get(this.closedOrdersUrl, {headers: this.headers})
              .toPromise()
              .then(response => response.json())
              .catch(this.handleError)
  }

  createOrder(currencyPairId, type, amount) {
    this.setHeaders();
    return this.http.post(this.ordersUrl, JSON.stringify({
          "currency_pair_id": currencyPairId,
          "type": type,
          "amount": amount}), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
  }

  closeOrder(orderId) {
    this.setHeaders();
    return this.http.post(this.ordersUrl + orderId + '/close/', {}, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
  }

  createTransfer(amount, transferType) {
    this.setHeaders();
    return this.http.post(this.transfersUrl, JSON.stringify({
          "transfer_type": transferType,
          "amount": amount}), {headers: this.headers})
            .toPromise()
            .then(res => {
              return res.json();
            })
            .catch(this.handleError);
  }

  getCurrencyPairValuesHistoryFromRawUrl(url) {
    this.setHeaders();
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError)
  }

  getCurrencyPairValuesHistory(currency_pair, period, page=undefined, dates=undefined) {
    let paramsDict = {currency_pair: currency_pair,
                      period: period,
                      creation_time_min: dates ? dates[0] : undefined,
                      creation_time_max: dates ? dates[1] : undefined,
                      page: page || undefined,
                      page_size: 30},

      params = Object.keys(paramsDict)
        .filter(function (key) {
          return paramsDict[key] !== undefined
        })
        .map(function (key) {
          return ''.concat(key, '=', paramsDict[key])
        })
        .join('&'),
      url = this.historyValuesUrl.concat('?', params);

    return this.getCurrencyPairValuesHistoryFromRawUrl(url);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
