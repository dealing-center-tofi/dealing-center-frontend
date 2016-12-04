import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { OrdersService } from '../services/orders.service';
import { RoundHelper } from '../helpers/roundHelper';
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
  private round = RoundHelper.round;

  constructor(private router: Router,
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
        fieldName: 'profit',
        sortable: true
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
    } else {
      this.getOrders();
    }
  }

  saveOrders() {
    this.orders.forEach(order => {
      order.currency_pair_name = order.currency_pair.name
    });
    this.sortOrders();
  }

  getOrders() {
    this.ordersService.getOrders().subscribe(res => {
      this.orders = res;
      this.saveOrders();
    });
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
    this.ordersService.closeOrder(order).then( () => {
      this.saveOrders();
    });
  }

  isOpened(order) {
    return order.status == 1;
  }

  isBuyType(order) {
    return order.type == 1;
  }
}
