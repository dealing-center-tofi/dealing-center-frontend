import { Component, NgZone } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { ApiService } from '../services/api.service.ts'
const config = require('./../../../config/api.conf');

declare var jQuery;

@Component({
  selector: 'profile',
  templateUrl: './profile.template.html',
  styleUrls: [ './profile.style.scss' ]
})
export class Profile {
  userInfo;
  account;
  transferType;
  isTransferFormShown = 0;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private zone: NgZone) {}

  ngOnInit() {
    if(!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    }
    this.getUserInfo();
    this.getAccount();
    this.setCollapseListeners();
  }

  setCollapseListeners() {
    jQuery('#collapse-deposit-form, #collapse-take-out-form').on('show.bs.collapse', () => {
      this.zone.run(() => {
        this.isTransferFormShown = 1;
      });
    });
    jQuery('#collapse-deposit-form, #collapse-take-out-form').on('hidden.bs.collapse', () => {
      this.zone.run(() => {
        this.isTransferFormShown = 0;
      });
    });
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
      'col-xl-7': this.isTransferFormShown,
      'offset-xl-0': this.isTransferFormShown,
      'col-xl-8': !this.isTransferFormShown,
      'offset-xl-2': !this.isTransferFormShown
    }

    return classes;
  }
 }
