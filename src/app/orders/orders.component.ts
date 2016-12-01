import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../services/api.service';
import { OrdersService } from '../services/orders.service';

import { OrderHelper } from './orderingHelper';
const config = require('./../../../config/api.conf');


@Component({
  selector: 'orders',
  templateUrl: './orders.template.html',
  styleUrls: ['./orders.style.scss']
})
export class OrdersPage {
  private orders: any;
  private tableHeaders: any;
  private sortOptions: any;
  private rankRound = config.rankRound;

  constructor(private apiService: ApiService,
              private router: Router,
              private ordersService: OrdersService) {
    this.tableHeaders = [
      {
        displayName: 'Order',
        fieldName: 'id',
        sortable: true
      },
      {
        displayName: 'Time',
        fieldName: 'start_time',
        sortable: true
      },
      {
        displayName: 'Currency Pair',
        fieldName: 'currency_pair_name',
        sortable: true
      },
      {
        displayName: 'Type',
        fieldName: 'type',
        sortable: true
      },
      {
        displayName: 'Status',
        fieldName: 'status',
        sortable: true
      },
      {
        displayName: 'Amount',
        fieldName: 'amount',
        sortable: true
      },
      {
        displayName: 'Profit',
        fieldName: '',
        sortable: false
      },
      {
        displayName: 'Close',
        fieldName: '',
        sortable: false
      },
    ];

    this.sortOptions = {
      sortType: 'id',
      sortReverse: true,
    };
  }

  ngOnInit() {
    if(!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    }

    this.getOrders();
  }

  createOrder(currencyPairId, type, amount) {
    if(!currencyPairId && !type && !amount) return;
    this.apiService.createOrder(+currencyPairId, +type, +amount)
      .then(order => this.orders.push(order));
  }

  saveOrders(res) {
    this.orders = res;
    this.orders.forEach(order => {
      order.currency_pair_name = order.currency_pair.name
    });

    this.sortOrders();
  }

  getOrders() {
    this.ordersService.orders.subscribe(res => this.saveOrders(res));
  }

  setSorting(fieldName) {
    if (this.sortOptions.sortType != fieldName) {
      this.sortOptions.sortType = fieldName;
      this.sortOptions.sortReverse = false;
    } else {
      this.sortOptions.sortReverse = !this.sortOptions.sortReverse;
    }

    this.sortOrders();
  }

  sortOrders() {
    OrderHelper.order(this.orders, this.sortOptions.sortType, this.sortOptions.sortReverse);
  }

  closeOrder(order) {
    var self = this;
    this.apiService.closeOrder(order.id).then(function(res) {
      let orders = self.orders.filter(function(item){return item.id != order.id});
      orders.push(res);
      self.saveOrders(orders);
    })
  }

}
