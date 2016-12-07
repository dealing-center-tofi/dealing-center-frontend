import { Component, ViewEncapsulation } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import {CurrencyPairsService} from "../services/currency-pairs.service";
const config = require('./../../../config/api.conf');

@Component({
  selector: 'login',
  styleUrls: [ './login.style.scss' ],
  templateUrl: './login.template.html',
  encapsulation: ViewEncapsulation.None,
})
export class Login {
  constructor(private http: Http,
              private router: Router,
              private currenciesPairsService: CurrencyPairsService) {
  }

  ngOnInit() {
    localStorage.removeItem('authToken');
    this.currenciesPairsService.unsubscribe();
  }

  submitForm(value: any):void{
    this.http.post(config.apiUrl + '/api/auth/login/', value)
      .subscribe(
        res => {
        let token = res.headers._headersMap.get('token');
        localStorage.setItem('authToken', token);

        this.currenciesPairsService.makeSubscribe();
        this.router.navigate(['/app']);
      }
    );
  }
}
