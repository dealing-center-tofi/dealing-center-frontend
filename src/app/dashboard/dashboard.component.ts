import { Component, ViewChild, AfterViewChecked } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ButtonsModule } from 'ng2-bootstrap/components/buttons';

import { ApiService } from '../services/api.service'
import { WebSocketService } from '../services/web-socket.service'

const config = require('./../../../config/api.conf');
declare var jQuery;

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.template.html',
  styleUrls: ['./dashboard.style.scss']
})
export class Dashboard {
  createOrderForm: FormGroup;
  currencyPairs;
  selectedPair;
  orderType;
  token;
  hideOrderSuccess = true;
  hideOrderError = true;

  constructor(private webSocketService: WebSocketService,
              private apiService: ApiService,
              private router: Router,
              private formBuilder: FormBuilder) {
    this.createOrderForm = formBuilder.group({
      'amount': [null, Validators.compose([Validators.required, Validators.pattern('(?:\d*\.)?\d+')])],
      'order-type': [null, Validators.required],
    });
    this.createOrderForm.valueChanges.subscribe( (form: any) => {
      this.orderType = form['order-type'];
      console.log('form', form);
     });
  }

  ngOnInit() {
    this.token = localStorage.getItem('authToken');
    if (!this.token) {
      this.router.navigate(['/login']);
    }
    this.getCurrencyPairs();
    this.getSocketData();
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

  isBigger(a, b) {
    return a >= b;
  }
}
