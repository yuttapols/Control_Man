import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { DEFAULT_LANDING_URL, sanitizeReturnUrl } from '../utils/url.util';
import { LOGIN_URL } from './auth.service';
import { AuthStore } from './auth.store';
import { PermissionService } from './permission.service';

export const FORBIDDEN_URL = '/403';

export const authGuard: CanActivateFn = (_route, state) => {
  const store = inject(AuthStore);
  const router = inject(Router);

  if (store.isAuthenticated()) {
    return true;
  }

  const returnUrl = sanitizeReturnUrl(state.url, DEFAULT_LANDING_URL);

  return router.createUrlTree(
    [LOGIN_URL],
    returnUrl === DEFAULT_LANDING_URL ? {} : { queryParams: { returnUrl } },
  );
};

export const guestGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);

  return store.isAuthenticated() ? router.createUrlTree([DEFAULT_LANDING_URL]) : true;
};

export function permissionGuard(...codes: readonly string[]): CanActivateFn {
  return () => {
    const permissions = inject(PermissionService);
    const router = inject(Router);

    return permissions.canAny(codes) ? true : router.createUrlTree([FORBIDDEN_URL]);
  };
}
