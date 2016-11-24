import { Component, ViewEncapsulation } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
const config = require('./../../../config/api.conf');

@Component({
  selector: 'sing-up',
  styleUrls: [ './sing-up.style.scss' ],
  templateUrl: './sing-up.template.html',
})
export class SingUp {
  constructor(private http: Http) {}

  submitForm(value: any):void{

    value.answer_secret_question = 'Vadim';
    value.account_currency = '2';

    this.http.post(config.apiUrl + '/api/users/', value)
      .subscribe(
        res => {
          let token = res.headers._headersMap.get('token');
          localStorage.setItem('authToken', token);
        }
      );
  }
}
