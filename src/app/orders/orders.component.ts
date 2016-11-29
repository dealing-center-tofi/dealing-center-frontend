import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../services/api.service'

@Component({
  selector: 'orders',
  templateUrl: './orders.template.html',
  styleUrls: ['./orders.style.scss']
})
export class OrdersPage {
  private orders: any;

  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {
    if(!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    }

    this.getOrders();
  }

  createOrder(currencyPairId, type, amount) {
    if(!currencyPairId && !type && !amount) return;
    this.apiService.createOrder(+currencyPairId, +type, +amount)
      .then(order => this.orders.results.push(order));
  }

  getOrders() {
    this.apiService
      .getOrders()
      .then( orders => this.orders = orders);
  }
}
