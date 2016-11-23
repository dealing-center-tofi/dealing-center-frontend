import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { RouterModule } from '@angular/router';
import { Profile } from './profile.component.ts';
import { WidgetModule } from '../layout/widget/widget.module';

export const routes = [
  { path: '', component: Profile, pathMatch: 'full' }
];


@NgModule({
  imports: [ CommonModule, RouterModule.forChild(routes), WidgetModule ],
  declarations: [ Profile ]
})
export default class ProfileModule {
  static routes = routes;
}
