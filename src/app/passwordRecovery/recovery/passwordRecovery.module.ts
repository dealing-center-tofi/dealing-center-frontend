import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PasswordRecovery } from './passwordRecovery.component.ts';

export const routes = [
  {path: '', component: PasswordRecovery, pathMatch: 'full'}
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [PasswordRecovery]
})
export default class PasswordRecoveryModule {
  static routes = routes;
}
