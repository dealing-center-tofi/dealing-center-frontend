import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { ApiService } from '../services/api.service.ts'
const config = require('./../../../config/api.conf');

@Component({
  selector: 'profile',
  templateUrl: './profile.template.html'
})
export class Profile {

  constructor(
    private apiService: ApiService,
    private router: Router) {}

  ngOnInit() {
    if(!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    }
}
