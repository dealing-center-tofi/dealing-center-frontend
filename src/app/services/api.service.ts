import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { CurrencyPairs } from './currency-pairs.ts'
const config = require('../../../config/api.conf');

@Injectable()
export class ApiService {

  private headers;
  private currencyPairsUrl = config.apiUrl + '/api/currency_pairs/';

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

  getCurrencyPairs(): Promise<CurrencyPairs> {
    this.setHeaders();
    return this.http.get(this.currencyPairsUrl, {headers: this.headers})
              .toPromise()
              .then(response => response.json() as CurrencyPairs)
              .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}