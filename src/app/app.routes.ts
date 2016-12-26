import { Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';


export const ROUTES: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  { path: 'app',   loadChildren: () => System.import('./layout/layout.module') },
  { path: 'login', loadChildren: () => System.import('./login/login.module') },
  { path: 'sing-up', loadChildren: () => System.import('./sing-up/sing-up.module') },
  { path: 'password-recovery', loadChildren: () => System.import('./passwordRecovery/recovery/passwordRecovery.module') },
  { path: 'password-recovery-confirm/:uidb64/:token', loadChildren: () => System.import('./passwordRecovery/recoveryConfirm/passwordRecoveryConfirm.module') },
  { path: 'error', component: ErrorComponent },
  { path: '**',    component: ErrorComponent }
];
