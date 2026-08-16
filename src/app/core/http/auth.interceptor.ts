import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

import { AUTH_BEARER_SKIP_ENDPOINTS } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';
import { AuthStore } from '../auth/auth.store';
import { AppConfigService } from '../config/app-config.service';
import { isProblemDetail } from '../error/problem-detail';
import { isTrustedApiUrl } from '../utils/url.util';

const UNAUTHORIZED = 401;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(AppConfigService);
  const store = inject(AuthStore);
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!isTrustedApiUrl(req.url, config.apiBaseUrl()) || skipsBearerToken(req.url)) {
    return next(req);
  }

  const accessToken = store.accessToken();

  return next(accessToken ? withBearerToken(req, accessToken) : req).pipe(
    catchError((error: unknown) => {
      if (statusOf(error) !== UNAUTHORIZED) {
        return throwError(() => error);
      }

      return auth.refreshAccessToken().pipe(
        catchError((refreshError: unknown) => {
          auth.handleSessionExpired(router.url);

          return throwError(() => refreshError);
        }),
        switchMap((refreshedToken) =>
          next(withBearerToken(req, refreshedToken)).pipe(
            catchError((retryError: unknown) => {
              if (statusOf(retryError) === UNAUTHORIZED) {
                auth.handleSessionExpired(router.url);
              }

              return throwError(() => retryError);
            }),
          ),
        ),
      );
    }),
  );
};

function withBearerToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function skipsBearerToken(url: string): boolean {
  return AUTH_BEARER_SKIP_ENDPOINTS.some((endpoint) => url.endsWith(endpoint));
}

function statusOf(error: unknown): number {
  if (error instanceof HttpErrorResponse) {
    return error.status;
  }

  return isProblemDetail(error) ? error.status : -1;
}
