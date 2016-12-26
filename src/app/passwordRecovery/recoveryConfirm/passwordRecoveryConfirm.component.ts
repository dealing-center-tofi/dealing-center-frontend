import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from '../../services/api.service.ts'
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {ValidateHelper} from "../../helpers/validateHelper";
const config = require('./../../../../config/api.conf');

declare var jQuery;

@Component({
  selector: 'passwordRecoveryConfirm',
  templateUrl: './passwordRecoveryConfirm.template.html',
  styleUrls: ['./passwordRecoveryConfirm.style.scss']
})

export class PasswordRecoveryConfirm {
  form:FormGroup;
  secondScreen:boolean = false;

  constructor(private apiService:ApiService,
              private formBuilder:FormBuilder,
              private activatedRoute: ActivatedRoute) {
    this.tuneValidation(formBuilder);
  }

  ngOnInit() {
  }

  submitForm(value:any):void {
    if (this.form.valid) {
      this.sendForm(value);
    } else {
      ValidateHelper.makeFieldsAsTouched(this.form);
    }
  }

  sendForm(value) {
    Object.keys(this.activatedRoute.params.value).forEach((key) => {
      value[key] = this.activatedRoute.params.value[key];
    });
    this.apiService.recoveryPasswordConfirm(value)
      .then(() => {this.secondScreen = true},
            (error) => {
              let errorJSON = error.json();
              if (errorJSON['non_field_errors']) {
                this.serverNonFieldErrorMessage += errorJSON['non_field_errors'];
              }
            });
  }

  onValueChanged(data?:any) {
    ValidateHelper.checkErrors(this.form, this.formErrors, this.validationMessages);
    this.serverNonFieldErrorMessage = '';
  }

  private tuneValidation(formBuilder) {
    this.form = formBuilder.group({
      'password': [null, Validators.compose([
        Validators.required,
      ])]
    });
    this.form.valueChanges.subscribe(data => this.onValueChanged(data));
  };

  formErrors = {
    'password': ''
  };

  validationMessages = {
    'password': {
      'required': 'You must type a password.',
    }
  };

  serverNonFieldErrorMessage = '';

}
