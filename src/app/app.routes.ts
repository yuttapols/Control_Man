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
    title: 'เข้าสู่ระบบ',
    loadComponent: () => import('./features/auth/login-page').then((m) => m.LoginPage),
  },
  {
    path: '',
    component: AppShell,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        title: 'ภาพรวม',
        data: { breadcrumb: 'ภาพรวม' },
        loadComponent: () =>
          import('./features/dashboard/dashboard-page').then((m) => m.DashboardPage),
      },
      {
        path: '403',
        title: 'ไม่มีสิทธิ์เข้าถึง',
        data: { breadcrumb: 'ไม่มีสิทธิ์เข้าถึง' },
        loadComponent: () => import('./features/error/forbidden-page').then((m) => m.ForbiddenPage),
      },
      {
        path: 'error',
        title: 'ระบบขัดข้อง',
        data: { breadcrumb: 'ระบบขัดข้อง' },
        loadComponent: () =>
          import('./features/error/server-error-page').then((m) => m.ServerErrorPage),
      },
      {
        path: '**',
        title: 'ไม่พบหน้าที่ต้องการ',
        data: { breadcrumb: 'ไม่พบหน้าที่ต้องการ' },
        loadComponent: () => import('./features/error/not-found-page').then((m) => m.NotFoundPage),
      },
    ],
  },
];
