import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { ApiService } from '../services/api.service';
import { CurrencyPairsService } from '../services/currency-pairs.service';
import { WebSocketService } from '../services/web-socket.service';

const config = require('./../../../config/api.conf');

@Component({
  selector: 'dashboard',
  providers: [CurrencyPairsService],
  templateUrl: './dashboard.template.html',
  styleUrls: ['./dashboard.style.scss']
})
export class Dashboard {
  currencyPairs;
  selectedPair;
  token;
  hideOrderSuccess = true;
  hideOrderError = true;

  constructor(private webSocketService:WebSocketService,
              private apiService:ApiService,
              private router:Router,
              private currencyPairsService: CurrencyPairsService) {
  }

  ngOnInit() {
    this.token = localStorage.getItem('authToken');
    if (!this.token) {
      this.router.navigate(['/login']);
    }
    this.getCurrencyPairs()
      .then( () => {
        this.getSocketData.call(this);
      });
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
    return this.apiService
      .getCurrencyPairs()
      .then(currencyPairs => {
        this.currencyPairs = currencyPairs;
        this.selectedPair = currencyPairs.results[0];
      });
  }

  roundValue(value) {
    return value.toFixed(config.rankRound);
  }

  getSocketData() {
    this.currencyPairsService.currencyPairs.subscribe(res => {
      let len = (res.length != this.currencyPairs.results.length)? 0: res.length;
      if (len === 0)
        return;
      for (let i = 0; i < len; i++) {
        this.currencyPairs.results[i].isBigger = this.isBigger(res[i].bid, this.currencyPairs.results[i].last_value.bid)
        this.currencyPairs.results[i].last_value = res[i];
      }
    });
  }

  isBigger(a, b) {
    return a >= b;
  }
}
