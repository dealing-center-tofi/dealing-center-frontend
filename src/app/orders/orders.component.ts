import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {OrdersService} from '../services/orders.service';
import {ApiService} from '../services/api.service';
import {RoundHelper} from '../helpers/roundHelper';
import {OrderHelper} from './orderingHelper';

declare var jQuery:any;
declare var d3:any;
declare var nv:any;


const config = require('./../../../config/api.conf');

@Component({
  selector: 'orders',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './orders.template.html',
  styleUrls: ['./orders.style.scss']
})
export class OrdersPage {
  private openedOrders:any;
  private closedOrders:any;
  private tableHeaders:any;
  private sortOptions:any;
  public orderFilter:any = {buy: true, sell: true};
  private round = RoundHelper.round;
  nvd3Chart:any;
  nvd3Data:any;
  curIdOrder;

  i = 0;

  constructor(private router:Router,
              private ordersService:OrdersService,
              private apiService:ApiService) {
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
    this.setFirstOrder();
  }

  setFirstOrder() {
    this.apiService.getOpenedOrders()
      .then((res) => {
        res = res.results[0];
        res && this.changeCurOrder(res);
      })
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

  changeCurOrder(order) {
    this.i = 0;
    this.curIdOrder = order.id;

    let bids = [], asks = [];

    this.apiService.getCurrencyPairValues(order.currency_pair.id)
      .then((res) => {

        this.nvd3Data[0].values = [];
        this.nvd3Data[1].values = [];

        res.results = res.results.reverse();

        res.results.map((order) => {
          this.pushNewValueNvd3Data(order);
        });
      })
      .then(() => {

        this.ordersService.getOrders().subscribe(res => {

          //TODO: res[0] = undefined ?
          if (res[0] && this.curIdOrder) {
            let order = res.filter(el => el.id == this.curIdOrder)[0].currency_pair.last_value;
            let bid = order.bid;
            let ask = order.ask;

            if (this.nvd3Data[0].values.length > 20)
              this.nvd3Data[0].values.splice(0, 1);
            if (this.nvd3Data[1].values.length > 20)
              this.nvd3Data[1].values.splice(0, 1);

            this.pushNewValueNvd3Data(order);
          }
        });
      });
  }

  pushNewValueNvd3Data(order) {
    this.nvd3Data[0].values.push({
      series: 0,
      x: new Date(order.creation_time),
      y: order.bid
    });
    this.nvd3Data[1].values.push({
      series: 0,
      x: new Date(order.creation_time),
      y: order.ask
    });

    this.rescaleChartAxisY();
  }

  rescaleChartAxisY() {
    let yMin = d3.min(this.nvd3Data[0].values, function (d) { return d.y; }),
      yMax = d3.max(this.nvd3Data[1].values, function (d) { return d.y; }),
      diff = yMax - yMin;
    this.nvd3Chart.forceY([yMin - diff * 0.05,
                           yMax + diff * 0.05]);
  }

  applyNvd3Data():void {

    this.nvd3Chart = nv.models.lineChart()
      .useInteractiveGuideline(true)
      .margin({left: 38, bottom: 30, right: 0})
      .color(['#dd5826', '#64bd63']);

    this.nvd3Chart.xAxis
      .showMaxMin(false)
      .tickFormat(function (d):Object {
        return d3.time.format("%M:%S")(new Date(d));
      });

    this.nvd3Chart.yAxis
      .showMaxMin(false)
      .tickFormat(d3.format('.4f'));

    this.nvd3Data = [
      {
        area: true,
        key: 'bid',
        values: []
      }, {
        area: true,
        key: 'ask',
        values: []
      }
    ];
  }
}
