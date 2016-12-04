import { Component, ViewChild, AfterViewChecked } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { OrdersService } from '../services/orders.service';
import { CurrencyPairsService } from '../services/currency-pairs.service';
import { RoundHelper } from '../helpers/roundHelper';

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
  round = RoundHelper.round;
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

  constructor(private ordersService:OrdersService,
              private router:Router,
              private currencyPairsService:CurrencyPairsService,
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
    } else {
      this.getCurrencyPairs();
    }
  }

  createOrder(form) {
    let orderType = parseFloat(form.value['order-type']);
    let amount = parseInt(form.value['amount']);
    form.reset();
    if (!this.selectedPair.id && !orderType && !amount) return;
    this.ordersService.createOrder(this.selectedPair.id, orderType, amount)
      .then(() => {
        this.hideOrderSuccess = false;
        setTimeout(() => {
          this.hideOrderSuccess = true;
        }, 2000)
      }).catch(() => {
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
