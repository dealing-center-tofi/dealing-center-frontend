import { Routes, RouterModule }  from '@angular/router';
import { Layout } from './layout.component';
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: '', component: Layout, children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadChildren: () => System.import('../dashboard/dashboard.module') },
    { path: 'orders-page', loadChildren: () => System.import('../orders/orders.module') },
    { path: 'profile', loadChildren: () => System.import('../profile/profile.module') },
  ]}
];

export const ROUTES = RouterModule.forChild(routes);
