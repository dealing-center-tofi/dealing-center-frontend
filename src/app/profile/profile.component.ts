import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { ApiService } from '../services/api.service.ts'
const config = require('./../../../config/api.conf');

@Component({
  selector: 'profile',
  templateUrl: './profile.template.html',
  styleUrls: [ './profile.style.scss' ]
})
export class Profile {
  userInfo;
  account;
  transferType;
  isTransfering = 0;

  constructor(
    private apiService: ApiService,
    private router: Router) {}

  ngOnInit() {
    if(!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    }
    this.getUserInfo();
    this.getAccount();
  }

  makeTransfer(amount) {
    let amountFloat = parseFloat(amount);
    console.log(this.transferType, amount);
    if(!this.transferType && !amount) return;
    this.apiService.createTransfer(amount, this.transferType);
  }

  getUserInfo() {
    this.apiService
      .getUserInfo()
      .then( userInfo => this.userInfo = userInfo);
  }

  getAccount() {
    this.apiService
      .getAccount()
      .then( account => this.account = account);
  }

  setClassesProfileInfo() {
    let classes = {
      'col-xl-7': this.isTransfering,
      'offset-xl-0': this.isTransfering,
      'col-xl-8': !this.isTransfering,
      'offset-xl-2': !this.isTransfering
    }

    return classes;
  }
 }