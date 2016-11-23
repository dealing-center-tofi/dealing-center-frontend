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
  currencyPairs;
  selectedPair;

  constructor(
    private apiService: ApiService,
    private router: Router) {}

  ngOnInit() {
    if(!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    }

    this.getCurrencyPairs();
  }

   createOrder(type, initialAmount) {
    if(!this.selectedPair.id && !type && !initialAmount) return;
    this.apiService.createOrder(this.selectedPair.id, +type, +initialAmount);
  }

  getCurrencyPairs() {
    this.apiService
      .getCurrencyPairs()
      .then( currencyPairs => this.currencyPairs = currencyPairs);
  }

  roundValue(value) {
    return value.toFixed(config.rankRound);
  }

  onSelect(pair) {
    this.selectedPair = pair;
  }

}
