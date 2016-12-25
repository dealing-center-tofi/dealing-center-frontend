import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PasswordRecoveryConfirm } from './passwordRecoveryConfirm.component.ts';

export const routes = [
  {path: '', component: PasswordRecoveryConfirm, pathMatch: 'full'}
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [PasswordRecoveryConfirm]
})
export default class PasswordRecoveryConfirmModule {
  static routes = routes;
}
