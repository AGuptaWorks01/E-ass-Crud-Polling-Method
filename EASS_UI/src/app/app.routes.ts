import { Routes } from '@angular/router';
import { DashBoardComponent } from './Module/dash-board/dash-board.component';
import { authGuard } from './AuthGuard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dash-board',
    pathMatch: 'full', // Full match for default redirect
  },
  {
    path: 'dash-board',
    component: DashBoardComponent,
    canActivate: [authGuard]
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
  {
    path: 'producList',
    loadComponent: () =>
      import('./Module/product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
    canActivate: [authGuard]
  },
  {
    path: 'add-edit-dlt',
    loadComponent: () =>
      import('./Module/add-edit-dlt/add-edit-dlt.component').then(
        (m) => m.AddEditDltComponent
      ),
    canActivate: [authGuard]
  },
  {
    path: 'add-edit-dlt/:id',
    loadComponent: () =>
      import('./Module/add-edit-dlt/add-edit-dlt.component').then(
        (m) => m.AddEditDltComponent
      ),
    canActivate: [authGuard]
  },
  {
    path: 'category',
    loadComponent: () =>
      import('./Module/category/category.component').then(
        (m) => m.CategoryComponent
      ),
    canActivate: [authGuard]
  },
];
