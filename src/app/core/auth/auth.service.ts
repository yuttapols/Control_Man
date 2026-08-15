import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, map, of, shareReplay, tap } from 'rxjs';

import { ApiResponse } from '../../shared/models/api.model';
import { ApiService } from '../api/api.service';
import { DEFAULT_LANDING_URL, sanitizeReturnUrl } from '../utils/url.util';
import { AUTH_ENDPOINTS, AuthSession, AuthenticatedUser, LoginRequest } from './auth.model';
import { AuthStore } from './auth.store';
import { csrfHeaders } from './csrf';

export const LOGIN_URL = '/login';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  private refreshInFlight: Observable<string> | null = null;

  login(request: LoginRequest): Observable<AuthenticatedUser> {
    return this.http
      .post<ApiResponse<AuthSession>>(this.api.url(AUTH_ENDPOINTS.login), request, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response.data),
        tap((session) => this.store.setSession(session)),
        map((session) => session.user),
      );
  }

  refreshAccessToken(): Observable<string> {
    this.refreshInFlight ??= this.http
      .post<ApiResponse<AuthSession>>(
        this.api.url(AUTH_ENDPOINTS.refresh),
        {},
        { withCredentials: true, headers: csrfHeaders(this.store.csrfToken()) },
      )
      .pipe(
        map((response) => response.data),
        tap((session) => this.store.setSession(session)),
        map((session) => session.accessToken),
        finalize(() => {
          this.refreshInFlight = null;
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

    return this.refreshInFlight;
  }

  restoreSession(): Observable<boolean> {
    return this.refreshAccessToken().pipe(
      map(() => true),
      catchError(() => {
        this.store.clear();

        return of(false);
      }),
    );
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(this.api.url(AUTH_ENDPOINTS.logout), {}, {
        withCredentials: true,
        headers: csrfHeaders(this.store.csrfToken()),
      })
      .pipe(
        catchError(() => of(undefined)),
        tap(() => {
          this.store.clear();
          void this.router.navigateByUrl(LOGIN_URL);
        }),
        map(() => undefined),
      );
  }

  handleSessionExpired(returnUrl: string): void {
    this.store.clear();

    const safeReturnUrl = sanitizeReturnUrl(returnUrl, DEFAULT_LANDING_URL);
    const queryParams = safeReturnUrl === DEFAULT_LANDING_URL ? {} : { returnUrl: safeReturnUrl };

    void this.router.navigate([LOGIN_URL], { queryParams });
  }
}
