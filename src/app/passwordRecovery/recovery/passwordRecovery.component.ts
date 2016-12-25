import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../services/api.service.ts'
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {ValidateHelper} from "../../helpers/validateHelper";
const config = require('./../../../../config/api.conf');

declare var jQuery;

@Component({
  selector: 'passwordRecovery',
  templateUrl: './passwordRecovery.template.html',
  styleUrls: ['./passwordRecovery.style.scss']
})

export class PasswordRecovery {
  form:FormGroup;
  secondScreen:boolean = false;

  constructor(private apiService:ApiService,
              private formBuilder:FormBuilder) {
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
    this.apiService.recoveryPassword(value)
      .then(() => {this.secondScreen = true},
            () => {console.log('password recovery error')});
  }

  onValueChanged(data?:any) {
    ValidateHelper.checkErrors(this.form, this.formErrors, this.validationMessages);
  }

  private tuneValidation(formBuilder) {
    this.form = formBuilder.group({
      'email': [null, Validators.compose([
        Validators.required,
        ValidateHelper.validateEmail,
      ])]
    });
    this.form.valueChanges.subscribe(data => this.onValueChanged(data));
  };

  formErrors = {
    'email': ''
  };

  validationMessages = {
    'email': {
      'required': 'You must type an email.',
      'validateEmail': 'Invalid email.',
    }
  };

}
