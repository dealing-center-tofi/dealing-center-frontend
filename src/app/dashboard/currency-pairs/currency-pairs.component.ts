import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { CurrencyPairs } from './currency-pairs.ts'
import { CurrencyPairsService } from './currency-pairs.service.ts'

@Component({
  selector: 'currency-pairs',
  templateUrl: './currency-pairs.template.html'
})

export class CurrencyPairs {
  currencyPairs: CurrencyPairs;

  constructor(
    private currencyPairsService: CurrencyPairsService,
    private router: Router) {}

  ngOnInit() {
    if(!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    }

    this.getCurrencyPairs();
  }

  getCurrencyPairs() {
    this.currencyPairsService
      .getCurrencyPairs()
      .then( currencyPairs => this.currencyPairs = currencyPairs);
  }
}
