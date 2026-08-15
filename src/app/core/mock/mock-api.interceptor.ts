import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import { ApiResponse, ProblemDetail } from '../../shared/models/api.model';
import { AUTH_ENDPOINTS, AuthSession, LoginRequest } from '../auth/auth.model';
import { AppConfigService } from '../config/app-config.service';
import { createCorrelationId } from '../http/correlation.interceptor';
import { isTrustedApiUrl } from '../utils/url.util';
import { MockAccount, findMockAccount, findMockAccountById } from './mock-accounts';

const MOCK_LATENCY_MS = 350;
const MOCK_SESSION_KEY = 'thc.mock.session-subject';
const MOCK_TOKEN_TTL_SECONDS = 900;

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(AppConfigService);

  if (!config.useMockApi() || !isTrustedApiUrl(req.url, config.apiBaseUrl())) {
    return next(req);
  }

  if (req.method === 'POST' && req.url.endsWith(AUTH_ENDPOINTS.login)) {
    return handleLogin(req.body as LoginRequest, req.url);
  }

  if (req.method === 'POST' && req.url.endsWith(AUTH_ENDPOINTS.refresh)) {
    return handleRefresh(req.url);
  }

  if (req.method === 'POST' && req.url.endsWith(AUTH_ENDPOINTS.logout)) {
    return handleLogout();
  }

  if (req.method === 'GET' && req.url.endsWith(AUTH_ENDPOINTS.currentUser)) {
    return handleCurrentUser(req.url);
  }

  return next(req);
};

function handleLogin(body: LoginRequest | null, url: string): Observable<HttpResponse<unknown>> {
  const account = body ? findMockAccount(body.username ?? '') : undefined;

  if (!account || account.password !== body?.password) {
    return failure(401, 'AUTHENTICATION_FAILED', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', url);
  }

  storeMockSubject(account.user.id);

  return success(buildSession(account));
}

function handleRefresh(url: string): Observable<HttpResponse<unknown>> {
  const subject = readMockSubject();
  const account = subject ? findMockAccountById(subject) : undefined;

  if (!account) {
    return failure(401, 'SESSION_EXPIRED', 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง', url);
  }

  return success(buildSession(account));
}

function handleLogout(): Observable<HttpResponse<unknown>> {
  clearMockSubject();

  return of(new HttpResponse({ status: 204 })).pipe(delay(MOCK_LATENCY_MS));
}

function handleCurrentUser(url: string): Observable<HttpResponse<unknown>> {
  const subject = readMockSubject();
  const account = subject ? findMockAccountById(subject) : undefined;

  if (!account) {
    return failure(401, 'SESSION_EXPIRED', 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง', url);
  }

  return success(account.user);
}

function buildSession(account: MockAccount): AuthSession {
  return {
    accessToken: `mock.${account.user.id}.${createCorrelationId()}`,
    tokenType: 'Bearer',
    expiresIn: MOCK_TOKEN_TTL_SECONDS,
    csrfToken: `mock-csrf.${account.user.id}`,
    user: account.user,
  };
}

function success<T>(data: T): Observable<HttpResponse<ApiResponse<T>>> {
  const body: ApiResponse<T> = {
    data,
    meta: {
      apiVersion: 'v1',
      requestId: createCorrelationId(),
      generatedAt: new Date().toISOString(),
    },
  };

  return of(new HttpResponse({ status: 200, body })).pipe(delay(MOCK_LATENCY_MS));
}

function failure(
  status: number,
  code: string,
  detail: string,
  instance: string,
): Observable<never> {
  const problem: ProblemDetail = {
    type: 'about:blank',
    title: detail,
    status,
    code,
    detail,
    instance,
    requestId: createCorrelationId(),
  };

  return throwError(
    () => new HttpErrorResponse({ status, error: problem, url: instance }),
  ).pipe(delay(MOCK_LATENCY_MS));
}

function storeMockSubject(userId: string): void {
  sessionStorage.setItem(MOCK_SESSION_KEY, userId);
}

function readMockSubject(): string | null {
  return sessionStorage.getItem(MOCK_SESSION_KEY);
}

function clearMockSubject(): void {
  sessionStorage.removeItem(MOCK_SESSION_KEY);
}
