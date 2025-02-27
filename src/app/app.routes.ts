import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { ActiveComponent } from './views/active/active.component';
import { RegisterComponent } from './views/register/register.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AuthGuard } from './service/auth/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Login page is the default
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'register', component: RegisterComponent },
  { path: 'active', component: ActiveComponent },
  { path: '**', redirectTo: '' }, // Redirect u
];
