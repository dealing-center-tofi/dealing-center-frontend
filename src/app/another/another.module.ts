import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { RouterModule } from '@angular/router';
import { AnotherPage } from './another.component.ts';
import { WidgetModule } from '../layout/widget/widget.module';

import { Orders } from './orders/orders.component.ts'

export const routes = [
  { path: '', component: AnotherPage, pathMatch: 'full' }
];

@NgModule({
  imports: [ CommonModule, RouterModule.forChild(routes), WidgetModule ],
  declarations: [ AnotherPage, Orders ]
})
export default class AnotherModule {
  static routes = routes;
}
