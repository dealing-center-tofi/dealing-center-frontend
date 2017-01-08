import { Component, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {ApiService} from "../services/api.service";
import {CurrencyPairsService} from "../services/currency-pairs.service";
import {Router} from "@angular/router";

import {ValidateHelper} from "../helpers/validateHelper";

const config = require('./../../../config/api.conf');
declare var jQuery;

@Component({
  selector: 'sing-up',
  styleUrls: ['./sing-up.style.scss'],
  templateUrl: './sing-up.template.html',
})
export class SingUp {
  signUpForm:FormGroup;
  isAccountCurrencyTouched = false;
  isSecretQuestionTouched = false;
  selectedCurrencyId;
  selectedSecretQuestionId;
  private currencies = [];
  private secretQuestions = [];

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
      });
    this.apiService.getSecretQuestions()
      .then(data => {
        this.secretQuestions = data.results;
        this.secretQuestions.map((currency) => currency.text = currency.question_text);
      });
    let self = this;
    jQuery('.datepicker').pickadate({
      format: 'yyyy-mm-dd',
      max: new Date(new Date().setFullYear(new Date(Date.now()).getFullYear() - 18)),
      editable: false,
      today: '',
      clear: 'Clear',
      close: 'Close',
      selectMonths: true,
      selectYears: 100,
      klass: {
        picker: 'picker'
      },
      onSet: function (context) {
        self.signUpForm.controls['birth_date'].setValue(this.get());
      }
    });
  }

  submitForm(value:any):void {
    let isFormValid = this.signUpForm.valid && this.selectedCurrencyId && this.selectedSecretQuestionId;
    if (isFormValid) {
      this.setSomeFields(value);
      this.sendForm(value);
    } else {
      this.makeFieldsAsTouched();
    }
  }

  private setSomeFields(value) {
    value.account_currency = this.selectedCurrencyId;
    value.secret_question_id = this.selectedSecretQuestionId;
    value.password = value.passwords.password;
  };

  private sendForm(value) {
    this.http.post(config.apiUrl + '/api/users/', value)
      .subscribe(
        res => {
          this.setToken(res);

          this.currencyPairsService.makeSubscribe();
          window.location.href = '/app';
          //this.router.navigate(['/app']);
        },
        error => {
          let errorJSON = error.json();
          for (let errorField in errorJSON) {
            let errorMessages = errorJSON[errorField];
            let control = this.signUpForm.controls[errorField];
            if (control) {
              ValidateHelper.makeControlError(control, errorMessages);
              this.onValueChanged();
            } else {
              errorMessages.forEach((message) => {
                this.serverNonFieldErrorMessage += message;
              })
            }
          }
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
    this.isSecretQuestionTouched = true;
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
        Validators.maxLength(ValidateHelper.MAX_LENGTH_FOR_EMAIL),
      ])],
      'birth_date': [null, Validators.compose([
        Validators.required,
      ])],
      'answer_secret_question': [null, Validators.compose([
        Validators.required,
        ValidateHelper.onlyWordsDigits,
        Validators.maxLength(ValidateHelper.MAX_LENGTH_FOR_ANSWER_SECRET_QUESTION),
      ])],
      'passwords': formBuilder.group({
        password: ['', Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(ValidateHelper.MAX_LENGTH_FOR_PASS),
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
      'maxlength': 'Email is too long.',
    },
    'birth_date': {
      'required': 'You must type a birth date.',
    },
    'answer_secret_question': {
      'required': 'You must type an answer.',
      'onlyWordsDigits': 'Only words and digits are allowed.',
      'maxlength': 'Answer is too long.',
    },
    'passwords': {
      'password': {
        'required': 'You must type a password.',
        'minlength': 'Password is too short.',
        'maxlength': 'Password is too long.',
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

  serverNonFieldErrorMessage = '';
}
