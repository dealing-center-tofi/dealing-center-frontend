import { Component, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {ApiService} from "../services/api.service";
import {CurrencyPairsService} from "../services/currency-pairs.service";
import {Router} from "@angular/router";

import {ValidateHelper} from "../helpers/validateHelper";

const config = require('./../../../config/api.conf');

@Component({
  selector: 'sing-up',
  styleUrls: ['./sing-up.style.scss'],
  templateUrl: './sing-up.template.html',
})
export class SingUp {
  signUpForm:FormGroup;
  isAccountCurrencyTouched = false;
  selectedCurrencyId;
  private currencies = [];

  constructor(private http:Http,
              private apiService:ApiService,
              private router:Router,
              private currencyPairsService:CurrencyPairsService,
              private formBuilder:FormBuilder) {
    this.tuneValidation(formBuilder);
  }

  ngOnInit() {
    this.apiService.getCurrencies()
      .then(data => {
        this.currencies = data.results;
        this.currencies.map((currency) => currency.text = currency.name);
      })
  }

  submitForm(value:any):void {
    let isFormValid = this.signUpForm.valid && this.selectedCurrencyId;
    if (isFormValid) {
      this.setSomeFields(value);
      this.sendForm(value);
    } else {
      this.makeFieldsAsTouched();
    }
  }

  private setSomeFields(value) {
    value.account_currency = this.selectedCurrencyId;
    value.password = value.passwords.password;
  };

  private sendForm(value) {
    this.http.post(config.apiUrl + '/api/users/', value)
      .subscribe(
        res => {
          this.setToken(res);

          this.currencyPairsService.makeSubscribe();
          this.router.navigate(['/app']);
        }
      );
  };

  private setToken(res) {
    let token = res.headers._headersMap.get('token');
    localStorage.setItem('authToken', token);
  };

  onValueChanged(data?:any) {
    ValidateHelper.checkErrors(this.signUpForm, this.formErrors, this.validationMessages);
    ValidateHelper.checkErrors(this.signUpForm.controls['passwords'], this.formErrorsPasswords, this.validationMessages.passwords);
  }

  private makeFieldsAsTouched() {
    this.isAccountCurrencyTouched = true;
    ValidateHelper.makeFieldsAsTouched(this.signUpForm);
    ValidateHelper.makeFieldsAsTouched(<FormGroup>this.signUpForm.controls['passwords']);
  }

  private tuneValidation(formBuilder) {
    this.signUpForm = formBuilder.group({
      'first_name': [null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        ValidateHelper.onlyWordsDigits,
      ])],
      'second_name': [null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        ValidateHelper.onlyWordsDigits,

      ])],
      'last_name': [null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        ValidateHelper.onlyWordsDigits,

      ])],
      'email': [null, Validators.compose([
        Validators.required,
        ValidateHelper.validateEmail,
      ])],
      'birth_date': [null, Validators.compose([
        Validators.required,
      ])],
      'answer_secret_question': [null, Validators.compose([
        Validators.required,
        ValidateHelper.onlyWordsDigits,
      ])],
      'passwords': formBuilder.group({
        password: ['', Validators.compose([
          Validators.required,
          Validators.minLength(6),
          ValidateHelper.needsCapitalLetter,
          ValidateHelper.needsLowerlLetter,
          ValidateHelper.needsNumber,
          ValidateHelper.needsSpecialCharacter,
        ])],
        confirm_password: ['', Validators.required]
      }, {validator: ValidateHelper.areEqual})
    });
    this.signUpForm.valueChanges.subscribe(data => this.onValueChanged(data));
  };

  validationMessages = {
    'first_name': {
      'required': 'You must type a first name.',
      'minlength': 'First name is too short.',
      'maxlength': 'First name is too long.',
      'onlyWordsDigits': 'Only words and digits are allowed.',
    },
    'second_name': {
      'required': 'You must type a second name.',
      'minlength': 'Second name is too short.',
      'maxlength': 'Second name is too long.',
      'onlyWordsDigits': 'Only words and digits are allowed.',
    },
    'last_name': {
      'required': 'You must type a last name.',
      'minlength': 'Last name is too short.',
      'maxlength': 'Last name is too long.',
      'onlyWordsDigits': 'Only words and digits are allowed.',
    },
    'email': {
      'required': 'You must type an email.',
      'validateEmail': 'Invalid email.',
    },
    'birth_date': {
      'required': 'You must type a birth date.',
    },
    'answer_secret_question': {
      'required': 'You must type an answer.',
      'onlyWordsDigits': 'Only words and digits are allowed.',
    },
    'passwords': {
      'password': {
        'required': 'You must type a password.',
        'minlength': 'Password is too short.',
        'needsCapitalLetter': 'Password must contain capital letters.',
        'needsLowerlLetter': 'Password must contain lower letters.',
        'needsNumber': 'Password must contain digits.',
        'needsSpecialCharacter': 'Password must contain special character.',
      },
      'confirm_password': {
        'required': 'Confirm password.',
      },
      'areEqual': 'Passwords are not equal.',
    },
  };

  formErrors = {
    'first_name': '',
    'second_name': '',
    'last_name': '',
    'email': '',
    'birth_date': '',
    'answer_secret_question': '',
    'passwords': '',
  };

  formErrorsPasswords = {
    'password': '',
    'confirm_password': '',
  };
}
