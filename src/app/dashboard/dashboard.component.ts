import { Component, ViewChild, AfterViewChecked } from '@angular/core';
import { Validators, NgForm } from '@angular/forms';
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
export class Dashboard implements AfterViewChecked {
  createOrderForm: NgForm;
  currencyPairs;
  selectedPair;
  orderType;
  radioModel = "Middle";
  token;
  hideOrderSuccess = true;
  hideOrderError = true;
  @ViewChild('createOrderForm') currentForm: NgForm;

  constructor(private webSocketService: WebSocketService,
              private apiService: ApiService,
              private router: Router){
    //          private formBuilder: FormBuilder) {
    //this.createOrderForm = formBuilder.group({
    //  'amount': [null, Validators.compose([Validators.required, Validators.pattern('(?:\d*\.)?\d+]')])],
    //  'order': [null, Validators.required],
    //  'gender': [null, Validators.required]
    //});
    //this.createOrderForm.valueChanges.subscribe( (form: any) => {
    //  console.log('form', form);
    // });
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  toggleButton(element) {

  }

  formChanged() {
    if (this.currentForm === this.createOrderForm) { return; }
    this.createOrderForm = this.currentForm;
    if (this.createOrderForm) {
      this.createOrderForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }

  onValueChanged(data?: any) {
    if (!this.createOrderForm) { return; }
    const form = this.createOrderForm.form;
    console.log(form.status);
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

  copyValues(oldValues, newValues) {
    if (!oldValues || !newValues) return;
    for (let i = 0; i < oldValues.length; i++) {
      oldValues[i].last_value.isUpBid = this.isBigger(newValues[i].bid, oldValues[i].last_value.bid);
      oldValues[i].last_value.isUpAsk = this.isBigger(newValues[i].ask, oldValues[i].last_value.ask);
      oldValues[i].last_value.bid = newValues[i].bid;
      oldValues[i].last_value.ask = newValues[i].ask;
    }
  }

  isBigger(a, b) {
    return a >= b;
  }
}
