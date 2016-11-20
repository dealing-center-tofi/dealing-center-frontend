import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
const config = require('./../../../config/api.conf');

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.template.html'
})
export class Dashboard {

  constructor(private http: Http,
              private router: Router) {

  }

  ngOnInit() {
    console.log(localStorage.getItem('authToken'));
    if(!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    }
  }

}
