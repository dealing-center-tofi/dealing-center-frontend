import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import 'jasny-bootstrap/docs/assets/js/vendor/holder.js';
import 'jasny-bootstrap/js/fileinput.js';
import 'jasny-bootstrap/js/inputmask.js';

import { SingUp } from './sing-up.component.ts';

export const routes = [
  { path: '', component: SingUp, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    SingUp
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export default class SingUpModule {
  static routes = routes;
}
