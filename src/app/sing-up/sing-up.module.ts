import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SelectModule } from 'ng2-select';

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
    ReactiveFormsModule,
    SelectModule,
    RouterModule.forChild(routes),
  ]
})
export default class SingUpModule {
  static routes = routes;
}
