import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { ApiResponse } from '../../shared/models/api.model';
import { AuthSession } from './auth.model';
import { AuthService } from './auth.service';
import { AuthStore } from './auth.store';

const REFRESH_URL = '/api/v1/portal/auth/refresh';
const LOGIN_URL = '/api/v1/portal/auth/login';
const LOGOUT_URL = '/api/v1/portal/auth/logout';

function sessionResponse(accessToken: string): ApiResponse<AuthSession> {
  return {
    data: {
      accessToken,
      expiresIn: 900,
      user: {
        id: 'user-1',
        username: 'editor',
        displayName: 'สมชาย ผู้บันทึก',
        email: 'editor@example.local',
        userLevel: 'Officer',
        roles: ['HOLIDAY_EDITOR'],
        permissions: ['holiday.revision.create'],
        status: 'ACTIVE',
      },
    },
    meta: { apiVersion: 'v1', requestId: 'req-1', generatedAt: '2026-08-15T00:00:00Z' },
  };
}

describe('AuthService', () => {
  let auth: AuthService;
  let store: AuthStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });

    auth = TestBed.inject(AuthService);
    store = TestBed.inject(AuthStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('stores the session after a successful login', () => {
    let signedInUser = '';
    auth.login({ username: 'editor', password: 'Password123!' }).subscribe((user) => {
      signedInUser = user.username;
    });

    const request = httpMock.expectOne(LOGIN_URL);
    expect(request.request.withCredentials).toBe(true);
    request.flush(sessionResponse('access-1'));

    expect(signedInUser).toBe('editor');
    expect(store.accessToken()).toBe('access-1');
    expect(store.isAuthenticated()).toBe(true);
  });

  it('keeps the store empty when login fails', () => {
    let failed = false;
    auth.login({ username: 'editor', password: 'wrong' }).subscribe({
      error: () => {
        failed = true;
      },
    });

    httpMock.expectOne(LOGIN_URL).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(failed).toBe(true);
    expect(store.isAuthenticated()).toBe(false);
  });

  it('issues a single refresh request for concurrent callers', () => {
    const tokens: string[] = [];

    auth.refreshAccessToken().subscribe((token) => tokens.push(token));
    auth.refreshAccessToken().subscribe((token) => tokens.push(token));

    const requests = httpMock.match(REFRESH_URL);
    expect(requests.length).toBe(1);

    requests[0].flush(sessionResponse('access-2'));

    expect(tokens).toEqual(['access-2', 'access-2']);
    expect(store.accessToken()).toBe('access-2');
  });

  it('allows a new refresh after the previous one settled', () => {
    auth.refreshAccessToken().subscribe();
    httpMock.expectOne(REFRESH_URL).flush(sessionResponse('access-3'));

    auth.refreshAccessToken().subscribe();
    httpMock.expectOne(REFRESH_URL).flush(sessionResponse('access-4'));

    expect(store.accessToken()).toBe('access-4');
  });

  it('reports a failed silent restore without keeping a session', () => {
    let restored = true;
    auth.restoreSession().subscribe((value) => {
      restored = value;
    });

    httpMock.expectOne(REFRESH_URL).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(restored).toBe(false);
    expect(store.isAuthenticated()).toBe(false);
  });

  it('revokes the session on the server and clears local state on logout', () => {
    store.setSession(sessionResponse('access-5').data);
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    auth.logout().subscribe();
    httpMock.expectOne(LOGOUT_URL).flush(null, { status: 204, statusText: 'No Content' });

    expect(store.isAuthenticated()).toBe(false);
    expect(store.accessToken()).toBeNull();
    expect(navigate).toHaveBeenCalledWith('/login');
  });

  it('clears local state even when the logout call fails', () => {
    store.setSession(sessionResponse('access-6').data);
    vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);

    auth.logout().subscribe();
    httpMock.expectOne(LOGOUT_URL).flush(null, { status: 500, statusText: 'Server Error' });

    expect(store.isAuthenticated()).toBe(false);
  });

  it('redirects to login with a safe return url when the session expires', () => {
    store.setSession(sessionResponse('access-7').data);
    const navigate = vi
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockResolvedValue(true);

    auth.handleSessionExpired('https://evil.example/steal');

    expect(store.isAuthenticated()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login'], { queryParams: {} });

    auth.handleSessionExpired('/holidays/12');

    expect(navigate).toHaveBeenLastCalledWith(['/login'], {
      queryParams: { returnUrl: '/holidays/12' },
    });
  });
});
