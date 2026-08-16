import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { ApiResponse } from '../../shared/models/api.model';
import { AuthSession } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';
import { AuthStore } from '../auth/auth.store';
import { authInterceptor } from './auth.interceptor';

const PORTAL_URL = '/api/v1/portal/holidays';
const OTHER_PORTAL_URL = '/api/v1/portal/users';
const LOGIN_URL = '/api/v1/portal/auth/login';
const REFRESH_URL = '/api/v1/portal/auth/refresh';
const LOGOUT_URL = '/api/v1/portal/auth/logout';
const EXTERNAL_URL = 'https://third-party.example/data';

const session: AuthSession = {
  accessToken: 'refreshed-token',
  expiresIn: 900,
  user: {
    id: 'user-1',
    username: 'editor',
    displayName: 'สมชาย ผู้บันทึก',
    email: 'editor@example.local',
    userLevel: 'Officer',
    roles: ['HOLIDAY_EDITOR'],
    permissions: [],
    status: 'ACTIVE',
  },
};

const refreshResponse: ApiResponse<AuthSession> = {
  data: session,
  meta: { apiVersion: 'v1', requestId: 'req-1', generatedAt: '2026-08-15T00:00:00Z' },
};

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let store: AuthStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(AuthStore);
    store.setSession({ ...session, accessToken: 'current-token' });
  });

  afterEach(() => httpMock.verify());

  it('attaches the access token to portal api requests', () => {
    http.get(PORTAL_URL).subscribe();

    const request = httpMock.expectOne(PORTAL_URL);
    expect(request.request.headers.get('Authorization')).toBe('Bearer current-token');
    request.flush({});
  });

  it('never attaches the access token to a foreign origin', () => {
    http.get(EXTERNAL_URL).subscribe();

    const request = httpMock.expectOne(EXTERNAL_URL);
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });

  it.each([LOGIN_URL, REFRESH_URL, LOGOUT_URL])(
    'does not attach the access token to %s',
    (url) => {
      http.post(url, {}).subscribe();

      const request = httpMock.expectOne(url);
      expect(request.request.headers.has('Authorization')).toBe(false);
      request.flush({});
    },
  );

  it('refreshes once for concurrent unauthorized requests and retries both', () => {
    const results: string[] = [];

    http.get<{ name: string }>(PORTAL_URL).subscribe((body) => results.push(body.name));
    http.get<{ name: string }>(OTHER_PORTAL_URL).subscribe((body) => results.push(body.name));

    const failed = httpMock.match((request) => !request.url.includes('/auth/'));
    expect(failed.length).toBe(2);
    failed.forEach((request) =>
      request.flush(null, { status: 401, statusText: 'Unauthorized' }),
    );

    const refreshRequests = httpMock.match(REFRESH_URL);
    expect(refreshRequests.length).toBe(1);
    expect(refreshRequests[0].request.headers.has('Authorization')).toBe(false);
    refreshRequests[0].flush(refreshResponse);

    const retried = httpMock.match((request) => !request.url.includes('/auth/'));
    expect(retried.length).toBe(2);
    retried.forEach((request) => {
      expect(request.request.headers.get('Authorization')).toBe('Bearer refreshed-token');
      request.flush({ name: request.request.url });
    });

    expect(results.length).toBe(2);
  });

  it('does not retry more than once when the retried request also fails', () => {
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    let failed = false;
    http.get(PORTAL_URL).subscribe({
      error: () => {
        failed = true;
      },
    });

    httpMock.expectOne(PORTAL_URL).flush(null, { status: 401, statusText: 'Unauthorized' });
    httpMock.expectOne(REFRESH_URL).flush(refreshResponse);
    httpMock.expectOne(PORTAL_URL).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(failed).toBe(true);
    httpMock.verify();
  });

  it('ends the session when the refresh call fails', () => {
    const auth = TestBed.inject(AuthService);
    const expired = vi.spyOn(auth, 'handleSessionExpired');
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    http.get(PORTAL_URL).subscribe({ error: () => undefined });

    httpMock.expectOne(PORTAL_URL).flush(null, { status: 401, statusText: 'Unauthorized' });
    httpMock.expectOne(REFRESH_URL).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(expired).toHaveBeenCalled();
  });
});
