import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';

import { PERMISSIONS } from '../../shared/constants/permission.constant';
import { AuthSession } from './auth.model';
import { authGuard, guestGuard, permissionGuard } from './auth.guard';
import { AuthStore } from './auth.store';

const session: AuthSession = {
  accessToken: 'token',
  expiresIn: 900,
  user: {
    id: 'user-1',
    username: 'auditor',
    displayName: 'วิชัย ผู้ตรวจสอบภายใน',
    email: 'auditor@example.local',
    userLevel: 'Manager',
    roles: ['AUDITOR'],
    permissions: [PERMISSIONS.auditRead],
    status: 'ACTIVE',
  },
};

function runAuthGuard(url: string): boolean | UrlTree {
  return TestBed.runInInjectionContext(
    () =>
      authGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot) as boolean | UrlTree,
  );
}

describe('route guards', () => {
  let store: AuthStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    store = TestBed.inject(AuthStore);
    router = TestBed.inject(Router);
  });

  it('sends anonymous users to login with a return url', () => {
    const result = runAuthGuard('/holidays/12');

    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result as UrlTree)).toBe('/login?returnUrl=%2Fholidays%2F12');
  });

  it('does not add a return url for the default landing page', () => {
    const result = runAuthGuard('/dashboard');

    expect(router.serializeUrl(result as UrlTree)).toBe('/login');
  });

  it('lets an authenticated user through', () => {
    store.setSession(session);

    expect(runAuthGuard('/dashboard')).toBe(true);
  });

  it('keeps an authenticated user away from the login page', () => {
    store.setSession(session);

    const result = TestBed.runInInjectionContext(
      () =>
        guestGuard({} as ActivatedRouteSnapshot, { url: '/login' } as RouterStateSnapshot) as
          | boolean
          | UrlTree,
    );

    expect(router.serializeUrl(result as UrlTree)).toBe('/dashboard');
  });

  it('redirects to 403 when the permission is missing', () => {
    store.setSession(session);
    const guard = permissionGuard(PERMISSIONS.settingRead);

    const result = TestBed.runInInjectionContext(
      () =>
        guard({} as ActivatedRouteSnapshot, { url: '/settings' } as RouterStateSnapshot) as
          | boolean
          | UrlTree,
    );

    expect(router.serializeUrl(result as UrlTree)).toBe('/403');
  });

  it('allows a route when any required permission is granted', () => {
    store.setSession(session);
    const guard = permissionGuard(PERMISSIONS.settingRead, PERMISSIONS.auditRead);

    const result = TestBed.runInInjectionContext(() =>
      guard({} as ActivatedRouteSnapshot, { url: '/audit-logs' } as RouterStateSnapshot),
    );

    expect(result).toBe(true);
  });
});
