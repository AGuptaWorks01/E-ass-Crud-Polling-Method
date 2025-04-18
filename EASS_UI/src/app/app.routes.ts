import { Routes } from '@angular/router';
import { DashBoardComponent } from './Module/dash-board/dash-board.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dash-board',
    pathMatch: 'full', // Full match for default redirect
  },
  {
    path: 'dash-board',
    component: DashBoardComponent,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./Module/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./Module/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
];
