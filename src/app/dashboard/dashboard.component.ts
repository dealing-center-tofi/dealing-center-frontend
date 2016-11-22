import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { ApiService } from '../services/api.service.ts'
const config = require('./../../../config/api.conf');

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.template.html'
})
export class Dashboard {
  currencyPairs: CurrencyPairs;

  constructor(
    private apiService: ApiService,
    private router: Router) {}

  ngOnInit() {
    if(!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    }

    this.getCurrencyPairs();
  }

  getCurrencyPairs() {
    this.apiService
      .getCurrencyPairs()
      .then( currencyPairs => this.currencyPairs = currencyPairs);
  }

  roundValue(value) {
    return value.toFixed(config.rankRound);
  }

}
