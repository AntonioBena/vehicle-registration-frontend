import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { ActiveComponent } from './views/active/active.component';
import { RegisterComponent } from './views/register/register.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Login page is the default
  // { path: 'main', component: MainComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'active', component: ActiveComponent },
  { path: '**', redirectTo: '' } // Redirect u
];
