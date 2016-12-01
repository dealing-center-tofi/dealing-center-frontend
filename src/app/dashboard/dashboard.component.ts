import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { ApiService } from '../services/api.service';
import { CurrencyPairsService } from '../services/currency-pairs.service';

const config = require('./../../../config/api.conf');

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.template.html',
  styleUrls: ['./dashboard.style.scss']
})
export class Dashboard {
  currencyPairs;
  selectedPair;
  token;
  hideOrderSuccess = true;
  hideOrderError = true;
  rankRound = config.rankRound;

  constructor(private apiService:ApiService,
              private router:Router,
              private currencyPairsService: CurrencyPairsService) {
  }

  ngOnInit() {
    this.token = localStorage.getItem('authToken');
    if (!this.token) {
      this.router.navigate(['/login']);
    }
    this.getCurrencyPairs();
  }

  createOrder(type, amount) {
    if (!this.selectedPair.id && !type && !amount) return;
    var self = this;
    this.apiService.createOrder(this.selectedPair.id, +type, +amount.value).then(function() {
      self.hideOrderSuccess = false;
      setTimeout(function() {
        self.hideOrderSuccess = true;
        amount.value = '';
      }, 2000)
    })
    .catch(function() {
      self.hideOrderError = false;
      setTimeout(function() {
        self.hideOrderError = true;
      }, 2000)
    });
  }

  getCurrencyPairs() {
    this.currencyPairsService.currencyPairs.subscribe(res => this.currencyPairs = res);
  }
}
