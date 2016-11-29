import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { ApiService } from '../services/api.service'
import { WebSocketService } from '../services/web-socket.service'

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

  constructor(private webSocketService:WebSocketService,
              private apiService:ApiService,
              private router:Router) {
  }

  ngOnInit() {
    this.token = localStorage.getItem('authToken');
    if (!this.token) {
      this.router.navigate(['/login']);
    }
    this.getCurrencyPairs();
    this.getSocketData();
  }

  createOrder(type, initialAmount) {
    if (!this.selectedPair.id && !type && !initialAmount) return;
    this.apiService.createOrder(this.selectedPair.id, +type, +initialAmount);
  }

  getCurrencyPairs() {
    this.apiService
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
    this.webSocketService.getData('new values').subscribe(res => {
      for (let i = 0; i < 6; i++) {
        this.currencyPairs.results[i].isBigger = this.isBigger(res[i].bid, this.currencyPairs.results[i].last_value.bid)
        this.currencyPairs.results[i].last_value = res[i];
      }
    });
  }

  copyValues(oldValues, newValues) {
    if (!oldValues || !newValues) return;
    for (let i = 0; i < oldValues.length; i++) {
      oldValues[i].last_value.isUpBid = this.isBigger(newValues[i].bid, oldValues[i].last_value.bid);
      oldValues[i].last_value.isUpAsk = this.isBigger(newValues[i].ask, oldValues[i].last_value.ask);
      oldValues[i].last_value.bid = newValues[i].bid;
      oldValues[i].last_value.ask = newValues[i].ask;
    }
  }

  isBigger(a, b) {
    return a >= b;
  }
}
