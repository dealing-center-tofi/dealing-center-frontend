import { Component, ViewChild, AfterViewChecked, NgZone } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { ApiService } from '../services/api.service.ts'
import { ValidateHelper } from '../helpers/validateHelper'
const config = require('./../../../config/api.conf');

declare var jQuery;

@Component({
  selector: 'profile',
  templateUrl: './profile.template.html',
  styleUrls: ['./profile.style.scss']
})
export class Profile {
  userInfo;
  account;
  transferType;
  isTransferFormShown = 0;
  makeTransferForm:FormGroup;
  formErrors = {
    'amount': '',
    'cardNumber': '',
    'cardExpiry': '',
    'cardCVC': '',
  };

  validationMessages = {
    'amount': {
      'required': 'You must type an amount.',
      'validateAmount': 'Type a number.',
    },
    'cardNumber': {
      'required': 'You must type a card number.',
      'validateCardNumberLength': 'Invalid length of card number.',
      'validateCardNumberBeginning': 'Invalid Card Number.',
      'validateDigits': 'Only digits are allowed.',
    },
    'cardExpiry': {
      'required': 'You must type an expiration date.',
      'validateExpiryDate': 'Invalid date.',
    },
    'cardCVC': {
      'required': 'You must type a CVC code.',
      'validateDigits': 'Only digits are allowed.',
      'validateCardCvvLength': 'Invalid length of CVV.'
    },
  };


  constructor(private apiService:ApiService,
              private router:Router,
              private zone:NgZone,
              private formBuilder:FormBuilder) {
    this.makeTransferForm = formBuilder.group({
      'amount': [null, Validators.compose([
        Validators.required,
        ValidateHelper.validateAmount,
      ])],
      'cardNumber': [null, Validators.compose([
        Validators.required,
        ValidateHelper.validateCardNumberLength,
        ValidateHelper.validateCardNumberBeginning,
        ValidateHelper.validateDigits,
      ])],
      'cardExpiry': [null, Validators.compose([
        Validators.required,
        ValidateHelper.validateExpiryDate,
      ])],
      'cardCVC': [null, Validators.compose([
        Validators.required,
        ValidateHelper.validateDigits,
        ValidateHelper.validateCardCvvLength,
      ])],
    });
    this.makeTransferForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?:any) {
    if (!this.makeTransferForm) {
      return;
    }
    const form = this.makeTransferForm;

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
    if (!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    }
    this.getUserInfo();
    this.getAccount();
    this.setCollapseListeners();
  }

  setCollapseListeners() {
    jQuery('#collapse-transfer-form').on('show.bs.collapse', () => {
      this.zone.run(() => {
        this.isTransferFormShown = 1;
      });
    });
    jQuery('#collapse-transfer-form').on('hidden.bs.collapse', () => {
      this.zone.run(() => {
        this.isTransferFormShown = 0;
      });
    });
  }

  collapseTransferForm(type, button) {
    let target = button.dataset['target'];
    console.log(type, this.transferType);
    if (this.isTransferFormShown && this.transferType === type) {
      jQuery(target).collapse('toggle');
    } else if (this.isTransferFormShown && this.transferType != type) {
      this.transferType = type;
    } else {
      this.transferType = type;
      jQuery(target).collapse('toggle');
    }
  }

  makeTransfer(form) {
    let amount = parseFloat(form.value['amount']);
    if (!this.transferType && !amount) return;
    this.apiService.createTransfer(amount, this.transferType)
      .then(()=> location.reload());
  }

  getUserInfo() {
    this.apiService
      .getUserInfo()
      .then(userInfo => this.userInfo = userInfo);
  }

  getAccount() {
    this.apiService
      .getAccount()
      .then(account => this.account = account);
  }

  setClassesProfileInfo() {
    let classes = {
      'col-xl-7': this.isTransferFormShown,
      'offset-xl-0': this.isTransferFormShown,
      'col-xl-8': !this.isTransferFormShown,
      'offset-xl-2': !this.isTransferFormShown
    }

    return classes;
  }
}
