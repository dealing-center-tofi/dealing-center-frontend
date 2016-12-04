import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Profile } from './profile.component.ts';

export const routes = [
  {path: '', component: Profile, pathMatch: 'full'}
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [Profile]
})
export default class ProfileModule {
  static routes = routes;
}
