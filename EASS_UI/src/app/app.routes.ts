import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full', // Full match for default redirect
  // },
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
