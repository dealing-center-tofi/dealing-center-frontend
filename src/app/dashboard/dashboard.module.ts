import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Dashboard } from './dashboard.component.ts';
import { WidgetModule } from '../layout/widget/widget.module';

//import 'pickadate/lib/picker.date'
//import 'pickadate/lib/pickadate.js'
//import 'pickadate/lib/picker.date';

export const routes = [
  {path: '', component: Dashboard, pathMatch: 'full'}
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [Dashboard]
})
export default class DashboardModule {
  static routes = routes;
}
