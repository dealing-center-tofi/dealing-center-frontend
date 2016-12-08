import { Component, ViewEncapsulation } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {CurrencyPairsService} from "../services/currency-pairs.service";
import {ValidateHelper} from "../helpers/validateHelper";
const config = require('./../../../config/api.conf');

@Component({
  selector: 'login',
  styleUrls: ['./login.style.scss'],
  templateUrl: './login.template.html',
  encapsulation: ViewEncapsulation.None,
})
export class Login {
  loginForm:FormGroup;

  constructor(private http:Http,
              private router:Router,
              private currenciesPairsService:CurrencyPairsService,
              private formBuilder:FormBuilder) {
    this.tuneValidation(formBuilder);
  }

  ngOnInit() {
    localStorage.removeItem('authToken');
    this.currenciesPairsService.unsubscribe();
  }

  submitForm(value:any):void {
    if (this.loginForm.valid) {
      this.sendForm(value);
    } else {
      ValidateHelper.makeFieldsAsTouched(this.loginForm);
    }
  }

  private sendForm(value) {
    this.http.post(config.apiUrl + '/api/auth/login/', value)
      .subscribe(
        res => {
          this.setToken(res);

          this.currenciesPairsService.makeSubscribe();
          this.router.navigate(['/app']);
        }
      );
  };

  private setToken(res) {
    let token = res.headers._headersMap.get('token');
    localStorage.setItem('authToken', token);
  };

  onValueChanged(data?:any) {
    ValidateHelper.checkErrors(this.loginForm, this.formErrors, this.validationMessages);
  }

  private tuneValidation(formBuilder) {
    this.loginForm = formBuilder.group({
      'email': [null, Validators.compose([
        Validators.required,
        ValidateHelper.validateEmail,
      ])],
      'password': [null, Validators.compose([
        Validators.required,
      ])],
    });
    this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));
  };

  formErrors = {
    'email': '',
    'password': '',
  };

  validationMessages = {
    'email': {
      'required': 'You must type an email.',
      'validateEmail': 'Invalid email.',
    },
    'password': {
      'required': 'You must type a password.',
    }
  };
}
