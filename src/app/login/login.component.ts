import { Component, ViewEncapsulation } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
const config = require('./../../../config/api.conf');

@Component({
  selector: 'login',
  styleUrls: [ './login.style.scss' ],
  templateUrl: './login.template.html',
  encapsulation: ViewEncapsulation.None,
})
export class Login {
  constructor(private http: Http, private router: Router) {

  }

  ngOnInit() {
    localStorage.removeItem('authToken');
  }

  submitForm(value: any):void{

    console.log(value);

    this.http.post(config.apiUrl + 'api/auth/login/', value)
      .subscribe(
        res => {
        let token = res.headers._headersMap.get('token');
        localStorage.setItem('authToken', token);
        this.router.navigate(['/app']);
      }
    );
  }
}
