import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { Dashboard } from './dashboard.component.ts';
import { WidgetModule } from '../layout/widget/widget.module';
import { ButtonsModule } from 'ng2-bootstrap/ng2-bootstrap';

export const routes = [
  { path: '', component: Dashboard, pathMatch: 'full' }
];


@NgModule({
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, ButtonsModule, RouterModule.forChild(routes), WidgetModule ],
  declarations: [ Dashboard ]
})
export default class DashboardModule {
  static routes = routes;
}
