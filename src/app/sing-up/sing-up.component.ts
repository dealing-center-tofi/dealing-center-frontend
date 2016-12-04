import { Component, ViewEncapsulation } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {ApiService} from "../services/api.service";
import {CurrencyPairsService} from "../services/currency-pairs.service";
import {Router} from "@angular/router";
const config = require('./../../../config/api.conf');

@Component({
  selector: 'sing-up',
  styleUrls: [ './sing-up.style.scss' ],
  templateUrl: './sing-up.template.html',
})
export class SingUp {
  private currencies = [];

  constructor(private http: Http,
              private apiService: ApiService,
              private router: Router,
              private currencyPairsService: CurrencyPairsService) {}

  ngOnInit() {
    this.apiService.getCurrencies()
      .then(data => {
        this.currencies = data.results;
      })
  }

  submitForm(value: any):void {

    this.http.post(config.apiUrl + '/api/users/', value)
      .subscribe(
        res => {
          let token = res.headers._headersMap.get('token');
          localStorage.setItem('authToken', token);

          this.currencyPairsService.makeSubscribe();
          this.router.navigate(['/app']);
        }
      );
  }
}
