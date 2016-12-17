import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { RouterModule } from '@angular/router';
import { OrdersPage } from './orders.component.ts';
import { WidgetModule } from '../layout/widget/widget.module';
import { OrderPipe } from './orders.filter';
import { Nvd3ChartModule } from '../layout/nvd3/nvd3.module';

export const routes = [
  { path: '', component: OrdersPage, pathMatch: 'full' }
];

@NgModule({
  imports: [ CommonModule, RouterModule.forChild(routes), WidgetModule, Nvd3ChartModule ],
  declarations: [
    OrdersPage,
    OrderPipe
  ]
})
export default class OrdersModule {
  static routes = routes;
}
