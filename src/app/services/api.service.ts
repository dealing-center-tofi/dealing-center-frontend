import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

const config = require('../../../config/api.conf');

@Injectable()
export class ApiService {

  private headers;
  private currencyPairsUrl = config.apiUrl + '/api/currency_pairs/';
  private ordersUrl = config.apiUrl + '/api/orders/';
  private userInfoUrl = config.apiUrl + '/api/users/me/';
  private accountUrl = config.apiUrl + '/api/account/me/';
  private transfersUrl = config.apiUrl + '/api/transfers/';

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

  getCurrencyPairs(): Promise<any> {
    this.setHeaders();
    return this.http.get(this.currencyPairsUrl, {headers: this.headers})
              .toPromise()
              .then(response => response.json())
              .catch(this.handleError);
  }

  getOrders(): Promise<any> {
    this.setHeaders();
    return this.http.get(this.ordersUrl, {headers: this.headers})
              .toPromise()
              .then(response => response.json())
              .catch(this.handleError);
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

  createTransfer(amount, transferType) {
    this.setHeaders();
    return this.http.post(this.transfersUrl, JSON.stringify({
          "transfer_type": transferType,
          "amount": amount}), {headers: this.headers})
            .toPromise()
            .then(res => {
              location.reload();
              return res.json();
            })
            .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
