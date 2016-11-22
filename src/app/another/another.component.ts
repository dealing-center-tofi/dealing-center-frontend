import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../services/api.service.ts'


@Component({
  selector: 'another',
  templateUrl: './another.template.html',
  styleUrls: ['./another.style.scss']
})
export class AnotherPage {
  private orders: any;

  constructor(private apiService: ApiService,
              private router: Router) {}
  
  ngOnInit() {
    if(!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    }

    this.getOrders();
  }

  getOrders() {
    this.apiService
      .getOrders()
      .then( orders => this.orders = orders);
  }
}
