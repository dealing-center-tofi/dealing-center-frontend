import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { RouterModule } from '@angular/router';
import { Dashboard } from './dashboard.component.ts';
import { WidgetModule } from '../layout/widget/widget.module';
import { CurrencyPairs } from './currency-pairs/currency-pairs.component.ts';

export const routes = [
  { path: '', component: Dashboard, pathMatch: 'full' }
];


@NgModule({
  imports: [ CommonModule, RouterModule.forChild(routes), WidgetModule ],
  declarations: [ Dashboard, CurrencyPairs ]
})
export default class DashboardModule {
  static routes = routes;
}
