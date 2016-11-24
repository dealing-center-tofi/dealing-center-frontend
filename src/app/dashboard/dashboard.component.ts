import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { ApiService } from '../services/api.service.ts'
import { CurrencyService } from '../services/currency.service.ts'

const config = require('./../../../config/api.conf');

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.template.html',
  styleUrls: ['./dashboard.style.scss']
})
export class Dashboard {
  currencyPairs;
  selectedPair;
  events = {
    'authorized': this.onAuthorize
    'new values': this.onNewValues
  };
  token;

  constructor(
    private currencyService: CurrencyService,
    private apiService: ApiService,
    private router: Router) {}

  ngOnInit() {
    this.token = localStorage.getItem('authToken');
    if(!this.token) {
      this.router.navigate(['/login']);
    }
    this.getCurrencyPairs();
    this.configurateSocket();
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

  configurateSocket() {
    this.currencyService.messages.subscribe( msg => this.onMessage.apply(this, [msg]));
    this.currencyService.messages.next(JSON.stringify(['authorize', {'token': this.token}]));
    this.currencyService.messages.next(JSON.stringify(['subscribe', {}]));
  }

  copyValues(oldValues, newValues) {
    if(!oldValues || !newValues) return;
    for(let i = 0; i < oldValues.length; i++){
      oldValues[i].last_value.isUpBid = this.isBigger(newValues[i].bid, oldValues[i].last_value.bid);
      oldValues[i].last_value.isUpAsk = this.isBigger(newValues[i].ask, oldValues[i].last_value.ask);
      oldValues[i].last_value.isDownBid = this.isSmaller(newValues[i].bid, oldValues[i].last_value.bid);
      oldValues[i].last_value.isDownAsk = this.isSmaller(newValues[i].ask, oldValues[i].last_value.ask);
      oldValues[i].last_value.bid = newValues[i].bid;
      oldValues[i].last_value.ask = newValues[i].ask;
    }
  }  
  
  isBigger(a, b) {
    return (a - b) < 0;
  }

  isSmaller(a, b) {
    return (a - b) > 0;
  }


  onAuthorize(msg) {
    console.log('authorized');
  }

  onNewValues(msg) {
    if (!this.currencyPairs) return;
    this.copyValues(this.currencyPairs.results, msg.data[0]);
  }

  onMessage(msg) {
    this.events[msg.eventName].apply(this, [msg]);
  }
}
