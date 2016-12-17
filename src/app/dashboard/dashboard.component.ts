import { Component, ViewChild, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { OrdersService } from '../services/orders.service';
import { CurrencyPairsService } from '../services/currency-pairs.service';
import { RoundHelper } from '../helpers/roundHelper';
import { ValidateHelper } from '../helpers/validateHelper';

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

  constructor(private ordersService:OrdersService,
              private router:Router,
              private currencyPairsService:CurrencyPairsService,
              private formBuilder:FormBuilder) {
    this.tuneValidation(formBuilder);
  }

  onValueChanged(data?:any) {
    this.serverNonFieldErrorMessage = '';
    this.orderType = this.createOrderForm.value['order-type'];
    ValidateHelper.checkErrors(this.createOrderForm, this.formErrors, this.validationMessages);
  }

  ngOnInit() {
    this.token = localStorage.getItem('authToken');
    if (!this.token) {
      this.router.navigate(['/login']);
    }
    this.getCurrencyPairs();
  }

  createOrder(form) {
    if (form.valid) {
      let orderType = parseInt(form.value['order-type']);
      let amount = parseFloat(form.value['amount']);
      form.reset();
      if (!this.selectedPair.id && !orderType && !amount) return;
      this.ordersService.createOrder(this.selectedPair.id, orderType, amount)
        .then(() => {
          this.hideOrderSuccess = false;
          setTimeout(() => {
            this.hideOrderSuccess = true;
          }, 2000)
        }).catch((error) => {
        let errorJSON = error.json();
        for (let errorField in errorJSON) {
          let errorMessages = errorJSON[errorField];
          let control = this.createOrderForm.controls[errorField];
          if (control) {
            ValidateHelper.makeControlError(control, errorMessages);
            this.onValueChanged();
          } else {
            errorMessages.forEach((message) => {
              this.serverNonFieldErrorMessage += message;
            })
          }
        }
      });
    } else {
      ValidateHelper.makeFieldsAsTouched(form);
    }
  }

  getCurrencyPairs() {
    this.currencyPairsService.getCurrencyPairs().subscribe(res => {
      this.currencyPairs = res;
      this.selectedPair = this.selectedPair || this.currencyPairs[0];
    });
  }

  private tuneValidation(formBuilder) {
    this.createOrderForm = formBuilder.group({
      'amount': [null, Validators.compose([
        Validators.required,
        ValidateHelper.validateAmount
      ])],
      'order-type': [null, Validators.required],
    });
    this.createOrderForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  formErrors = {
    'amount': '',
  };

  validationMessages = {
    'amount': {
      'required': 'You must type an amount.',
      'validateAmount': 'Type a number.',
    },
  };

  serverNonFieldErrorMessage = '';
}
