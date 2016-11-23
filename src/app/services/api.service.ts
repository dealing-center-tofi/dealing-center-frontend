import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

const config = require('../../../config/api.conf');

@Injectable()
export class ApiService {

  private headers;
  private currencyPairsUrl = config.apiUrl + '/api/currency_pairs/';
  private ordersUrl = config.apiUrl + '/api/orders/';

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

  createOrder(currencyPairId, type, initialAmount) {
    this.setHeaders();
    console.log(arguments);
    return this.http.post(this.ordersUrl, JSON.stringify({
          "currency_pair_id": currencyPairId,
          "type": type,
          "initial_amount": initialAmount}), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
