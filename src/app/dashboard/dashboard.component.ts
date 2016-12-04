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
  createOrderForm:FormGroup;
  currencyPairs;
  selectedPair;
  orderType;
  token;
  hideOrderSuccess = true;
  hideOrderError = true;
  patternAmount:string = '(?:\\d*\\.)?\\d+';
  formErrors = {
    'amount': '',
  };

  validationMessages = {
    'amount': {
      'required': 'You must type an amount.',
      'pattern': 'Type a number.',
    },
  };

  constructor(private webSocketService:WebSocketService,
              private apiService:ApiService,
              private router:Router,
              private formBuilder:FormBuilder) {
    this.createOrderForm = formBuilder.group({
      'amount': [null, Validators.compose([Validators.required, Validators.pattern(this.patternAmount)])],
      'order-type': [null, Validators.required],
    });
    this.createOrderForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?:any) {
    if (!this.createOrderForm) {
      return;
    }
    const form = this.createOrderForm;
    this.orderType = form.value['order-type'];

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }


  ngOnInit() {
    this.token = localStorage.getItem('authToken');
    if (!this.token) {
      this.router.navigate(['/login']);
    }
    this.getCurrencyPairs();
    this.getSocketData();
  }

  createOrder(form) {
    let orderType = parseFloat(form.value['order-type']);
    let amount = parseInt(form.value['amount']);
    form.reset();
    if (!this.selectedPair.id && !orderType && !amount) return;
    var self = this;
    this.apiService.createOrder(this.selectedPair.id, orderType, amount)
      .then(function () {
        self.hideOrderSuccess = false;
        setTimeout(function () {
          self.hideOrderSuccess = true;
        }, 2000)
      })
      .catch(function () {
        self.hideOrderError = false;
        setTimeout(function () {
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
