import { Component, ViewChild, AfterViewChecked, NgZone } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { ApiService } from '../services/api.service.ts'
import { ValidateHelper } from '../helpers/validateHelper'
import {AccountService} from "../services/account.service";
const config = require('./../../../config/api.conf');

declare var jQuery;

@Component({
  selector: 'profile',
  templateUrl: './profile.template.html',
  styleUrls: ['./profile.style.scss']
})
export class Profile {
  makeTransferForm:FormGroup;
  userInfo;
  account;
  transferType;
  isTransferFormShown = 0;

  constructor(private apiService:ApiService,
              private accountService:AccountService,
              private router:Router,
              private zone:NgZone,
              private formBuilder:FormBuilder) {
    this.tuneValidation(formBuilder);
  }

  onValueChanged(data?:any) {
    this.serverNonFieldErrorMessage = '';
    ValidateHelper.checkErrors(this.makeTransferForm, this.formErrors, this.validationMessages);
  }

  ngOnInit() {
    if (!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    }
    this.getUserInfo();
    this.getAccount();
    this.setCollapseListeners();
  }

  makeTransfer(form) {
    if (form.valid) {
      let amount = parseFloat(form.value['amount']);
      if (!this.transferType && !amount) return;
      this.apiService.createTransfer(amount, this.transferType)
        .then(()=> {
          this.accountService.updateAccount();
          form.reset();
          jQuery('#collapse-transfer-form').collapse('toggle');
        })
        .catch((error) => {
          let errorJSON = error.json();
          for (let errorField in errorJSON) {
            let errorMessages = errorJSON[errorField];
            let control = this.makeTransferForm.controls[errorField];
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

  getUserInfo() {
    this.apiService
      .getUserInfo()
      .then(userInfo => this.userInfo = userInfo);
  }

  getAccount() {
    this.accountService
      .getAccount()
      .subscribe(account => {
        this.account = account;
      });
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
    if (this.isTransferFormShown && this.transferType === type) {
      jQuery(target).collapse('toggle');
    } else if (this.isTransferFormShown && this.transferType != type) {
      this.makeTransferForm.reset();
      this.transferType = type;
    } else if (!this.isTransferFormShown && this.transferType != type) {
      jQuery(target).collapse('toggle');
      this.makeTransferForm.reset();
      this.transferType = type;
    } else {
      this.transferType = type;
      jQuery(target).collapse('toggle');
    }
  }

  setClassesProfileInfo() {
    let classes = {
      'col-xl-7': this.isTransferFormShown,
      'offset-xl-0': this.isTransferFormShown,
      'col-xl-8': !this.isTransferFormShown,
      'offset-xl-2': !this.isTransferFormShown
    };

    return classes;
  }

  private tuneValidation(formBuilder) {
    this.makeTransferForm = formBuilder.group({
      'amount': [null, Validators.compose([
        Validators.required,
        Validators.maxLength(ValidateHelper.MAX_LENGTH_FOR_AMOUNT),
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
  };

  formErrors = {
    'amount': '',
    'cardNumber': '',
    'cardExpiry': '',
    'cardCVC': '',
  };

  validationMessages = {
    'amount': {
      'required': 'You must type an amount.',
      'maxlength': 'Amount is too big.',
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

  serverNonFieldErrorMessage = '';
}
