import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Orders } from '.orders.ts'
import { ApiService } from '../../services/api.service.ts'
// const config = require('./../../../config/api.conf');

@Component({
  selector: 'orders',
  templateUrl: './orders.template.html',
  styleUrls: ['./orders.style.scss']
})

export class Orders {
  private orders: Orders;

  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {
    console.log(localStorage.getItem('authToken'));
    if(!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    }

    this.getOrders();
  }

  getOrders() {
    this.apiService
      .getOrders()
      .then( orders => this.orders = orders);
  }
}
