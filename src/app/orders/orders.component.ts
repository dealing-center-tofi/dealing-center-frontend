import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {OrdersService} from '../services/orders.service';
import {ApiService} from '../services/api.service';
import {RoundHelper} from '../helpers/roundHelper';
import {OrderHelper} from './orderingHelper';
import {OrderPipe} from './orders.filter';

declare var jQuery: any;
declare var d3: any;
declare var nv: any;


const config = require('./../../../config/api.conf');

@Component({
  selector: 'orders',
  pipes: [OrderPipe],
  templateUrl: './orders.template.html',
  styleUrls: ['./orders.style.scss']
})
export class OrdersPage {
  private openedOrders: any;
  private closedOrders: any;
  private tableHeaders: any;
  private sortOptions: any;
  public orderFilter: any = {buy: true, sell: true};
  private round = RoundHelper.round;
  nvd3Chart: any;
  nvd3Data: any;

  constructor(private router: Router,
              private ordersService: OrdersService,
              private apiService: ApiService) {
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
        fieldName: 'end_profit',
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
    if (!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    } else {
      this.getOrders();
      this.switchOrderStatus(1);
    }

    this.applyNvd3Data();
  }

  saveOrders(orders) {
    orders.forEach(order => {
      order.currency_pair_name = order.currency_pair.name
    });
  }

  getOrders() {
    this.ordersService.getOrders().subscribe(res => {
      this.openedOrders = res;
      this.saveOrders(this.openedOrders);
    });
  }

  applyFilter(type) {
    let buy = this.orderFilter.buy;
    let sell = this.orderFilter.sell;
    if (type === 1) {
      buy = !buy;
      sell = buy ? sell : true;
    } else {
      sell = !sell;
      buy = sell ? buy : true;
    }
    this.orderFilter = {
      buy: buy,
      sell: sell
    }
  }

  setSorting(fieldName) {
    if (this.sortOptions.sortType != fieldName) {
      this.sortOptions.sortType = fieldName;
      this.sortOptions.sortReverse = false;
    } else {
      this.sortOptions.sortReverse = !this.sortOptions.sortReverse;
    }

    this.sortOrders(this.closedOrders || this.openedOrders);
  }

  sortOrders(orders) {
    OrderHelper.order(orders, this.sortOptions.sortType, this.sortOptions.sortReverse);
  }

  closeOrder(order) {
    this.ordersService.closeOrder(order).then(() => {
      this.saveOrders(this.openedOrders);
    });
  }

  switchOrderStatus(status) {
    if (status === 1) {
      this.closedOrders = undefined;
      this.saveOrders(this.openedOrders);
      this.sortOrders(this.openedOrders);
    } else {
      this.getClosedOrders();
    }
  }

  getClosedOrders() {
    this.apiService.getAllClosedOrders()
      .then(res => {
        this.closedOrders = res.results;
        this.saveOrders(this.closedOrders);
        this.sortOrders(this.closedOrders);
      });
  }

  isOpened(order) {
    return order.status == 1;
  }

  isBuyType(order) {
    return order.type == 1;
  }

  applyNvd3Data(): void {

    this.nvd3Chart = nv.models.lineChart()
      .useInteractiveGuideline(true)
      .margin({left: 28, bottom: 30, right: 0})
      .color(['#82DFD6', '#ddd']);

    this.nvd3Chart.xAxis
      .showMaxMin(false)
      .tickFormat(function (d): Object {
        return d3.time.format('%b %d')(new Date(d));
      });

    this.nvd3Chart.yAxis
      .showMaxMin(false)
      .tickFormat(d3.format(',f'));

    this.nvd3Data = [{
      area: true,
      key: 'Search',
      values: [{
        series: 0,
        x: 1,
        y: 100
      }, {
        series: 0,
        x: 2,
        y: 200
      }, {
        series: 0,
        x: 3,
        y: 150
      },]
    }];
  }

  getChatData(data): void {

    this.nvd3Data[0].values.push({
      series: 0,
      x: data.y,
      y: data.a
    });
  }
}
