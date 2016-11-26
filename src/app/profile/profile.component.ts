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
 }