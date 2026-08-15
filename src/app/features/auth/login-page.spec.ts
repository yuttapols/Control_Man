import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { AuthStore } from '../../core/auth/auth.store';
import { errorInterceptor } from '../../core/http/error.interceptor';
import { ApiResponse } from '../../shared/models/api.model';
import { AuthSession } from '../../core/auth/auth.model';
import { LoginPage } from './login-page';

const LOGIN_URL = '/api/v1/portal/auth/login';

const successResponse: ApiResponse<AuthSession> = {
  data: {
    accessToken: 'access-1',
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
  },
  meta: { apiVersion: 'v1', requestId: 'req-1', generatedAt: '2026-08-15T00:00:00Z' },
};

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let page: LoginPage;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
        providePrimeNG({ theme: { preset: Aura } }),
        MessageService,
      ],
    });

    fixture = TestBed.createComponent(LoginPage);
    page = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => httpMock.verify());

  it('describes both inputs for assistive technology', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('#username')?.getAttribute('aria-describedby')).toBe(
      'username-help username-error',
    );
    expect(host.querySelector('#password')?.getAttribute('aria-describedby')).toBe(
      'password-help password-error',
    );
  });

  it('blocks submit and shows field errors when the form is empty', async () => {
    page.submit();
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('#username-error')?.textContent).toContain('กรุณากรอกข้อมูลนี้');
    expect(page.errorSummary().length).toBe(2);
    httpMock.expectNone(LOGIN_URL);
  });

  it('rejects a password shorter than the policy without calling the api', async () => {
    page.form.setValue({ username: 'editor', password: 'short', rememberUsername: false });
    page.submit();
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('#password-error')?.textContent).toContain('อย่างน้อย 8');
    httpMock.expectNone(LOGIN_URL);
  });

  it('shows a generic message and clears the password when credentials are rejected', async () => {
    page.form.setValue({ username: 'editor', password: 'WrongPassword1', rememberUsername: false });
    page.submit();

    httpMock.expectOne(LOGIN_URL).flush(null, { status: 401, statusText: 'Unauthorized' });
    await fixture.whenStable();

    expect(page.authError()).toContain('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    expect(page.form.controls.password.value).toBe('');
    expect(page.submitting()).toBe(false);
  });

  it('maps server validation errors onto the matching field', async () => {
    page.form.setValue({ username: 'editor', password: 'Password123!', rememberUsername: false });
    page.submit();

    httpMock.expectOne(LOGIN_URL).flush(
      {
        type: 'about:blank',
        title: 'Validation failed',
        status: 400,
        code: 'VALIDATION_ERROR',
        detail: 'One or more fields are invalid',
        instance: LOGIN_URL,
        requestId: 'req-2',
        errors: [{ field: 'username', code: 'INVALID', message: 'บัญชีนี้ถูกระงับ' }],
      },
      { status: 400, statusText: 'Bad Request' },
    );
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('#username-error')?.textContent).toContain('บัญชีนี้ถูกระงับ');
  });

  it('signs in, remembers only the username and navigates to the return url', async () => {
    const navigate = vi
      .spyOn(TestBed.inject(Router), 'navigateByUrl')
      .mockResolvedValue(true);

    page.form.setValue({ username: ' editor ', password: 'Password123!', rememberUsername: true });
    page.submit();

    httpMock.expectOne(LOGIN_URL).flush(successResponse);
    await fixture.whenStable();

    expect(TestBed.inject(AuthStore).isAuthenticated()).toBe(true);
    expect(localStorage.getItem('thc.remembered-username')).toBe('editor');
    expect(localStorage.getItem('thc.access-token')).toBeNull();
    expect(navigate).toHaveBeenCalledWith('/dashboard');
  });
});
