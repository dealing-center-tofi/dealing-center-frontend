import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { OrdersService } from '../services/orders.service';
import { CurrencyPairsService } from '../services/currency-pairs.service';
import { RoundHelper } from '../helpers/roundHelper';

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
  round = RoundHelper.round;

  constructor(private ordersService:OrdersService,
              private router:Router,
              private currencyPairsService: CurrencyPairsService) {
  }

  ngOnInit() {
    this.token = localStorage.getItem('authToken');
    if (!this.token) {
      this.router.navigate(['/login']);
    } else {
      this.getCurrencyPairs();
    }
  }

  createOrder(type, amount) {
    if (!this.selectedPair.id && !type && !amount) return;
    this.ordersService.createOrder(this.selectedPair.id, +type, parseFloat(amount.value)).then( () => {
      this.hideOrderSuccess = false;
      setTimeout(() => {
        this.hideOrderSuccess = true;
        amount.value = '';
      }, 2000)
    }).catch( () => {
      this.hideOrderError = false;
      setTimeout(() => {
        this.hideOrderError = true;
      }, 2000)
    });
  }

  getCurrencyPairs() {
    this.currencyPairsService.getCurrencyPairs().subscribe(res => this.currencyPairs = res);
  }
}
