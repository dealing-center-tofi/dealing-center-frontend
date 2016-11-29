import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { RouterModule } from '@angular/router';
import { OrdersPage } from './orders.component.ts';
import { WidgetModule } from '../layout/widget/widget.module';

export const routes = [
  { path: '', component: OrdersPage, pathMatch: 'full' }
];

@NgModule({
  imports: [ CommonModule, RouterModule.forChild(routes), WidgetModule ],
  declarations: [ OrdersPage ]
})
export default class OrdersModule {
  static routes = routes;
}
