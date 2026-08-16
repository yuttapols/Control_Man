import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/auth/auth.guard';
import { AppShell } from './layout/app-shell/app-shell';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    title: 'route.login',
    loadComponent: () => import('./features/auth/login-page').then((m) => m.LoginPage),
  },
  {
    path: '',
    component: AppShell,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        title: 'route.dashboard',
        data: { breadcrumb: 'route.dashboard', breadcrumbIcon: 'pi pi-chart-bar' },
        loadComponent: () =>
          import('./features/dashboard/dashboard-page').then((m) => m.DashboardPage),
      },
      {
        path: '403',
        title: 'route.forbidden',
        data: { breadcrumb: 'route.forbidden', breadcrumbIcon: 'pi pi-lock' },
        loadComponent: () => import('./features/error/forbidden-page').then((m) => m.ForbiddenPage),
      },
      {
        path: 'error',
        title: 'route.serverError',
        data: { breadcrumb: 'route.serverError', breadcrumbIcon: 'pi pi-exclamation-triangle' },
        loadComponent: () =>
          import('./features/error/server-error-page').then((m) => m.ServerErrorPage),
      },
      {
        path: '**',
        title: 'route.notFound',
        data: { breadcrumb: 'route.notFound', breadcrumbIcon: 'pi pi-search' },
        loadComponent: () => import('./features/error/not-found-page').then((m) => m.NotFoundPage),
      },
    ],
  },
];
