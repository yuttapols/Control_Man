import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ProblemDetail } from '../../shared/models/api.model';
import { AppConfigService } from '../config/app-config.service';
import { TIMEOUT_ERROR_CODE, isNotifiableError, problemMessageKey } from '../error/problem-detail';
import { httpContextFor } from './http-context';
import { timeoutInterceptor } from './timeout.interceptor';

const URL = '/api/v1/portal/holidays';

describe('timeoutInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([timeoutInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('lets a response that arrives in time through untouched', () => {
    let received: unknown = null;

    http.get(URL).subscribe((value) => (received = value));
    httpMock.expectOne(URL).flush({ ok: true });

    expect(received).toEqual({ ok: true });
  });

  it('converts a slow request into a translatable ProblemDetail', () => {
    let problem: ProblemDetail | null = null;

    http
      .get(URL, { context: httpContextFor({ timeoutMs: 50 }) })
      .subscribe({ error: (error: ProblemDetail) => (problem = error) });

    httpMock.expectOne(URL);
    vi.advanceTimersByTime(60);

    expect(problem).not.toBeNull();
    expect(problem!.code).toBe(TIMEOUT_ERROR_CODE);
    expect(problemMessageKey(problem!)).toBe('error.message.timeout');
  });

  it('marks a timeout as notifiable so the user is told', () => {
    let problem: ProblemDetail | null = null;

    http
      .get(URL, { context: httpContextFor({ timeoutMs: 20 }) })
      .subscribe({ error: (error: ProblemDetail) => (problem = error) });

    httpMock.expectOne(URL);
    vi.advanceTimersByTime(30);

    expect(isNotifiableError(problem!)).toBe(true);
  });

  it('falls back to the runtime configured limit', () => {
    const configured = TestBed.inject(AppConfigService).apiTimeoutMs();
    let problem: ProblemDetail | null = null;

    http.get(URL).subscribe({ error: (error: ProblemDetail) => (problem = error) });

    httpMock.expectOne(URL);
    vi.advanceTimersByTime(configured - 1);

    expect(problem).toBeNull();

    vi.advanceTimersByTime(2);

    expect(problem!.code).toBe(TIMEOUT_ERROR_CODE);
  });

  it('keeps a real http failure as-is instead of reporting a timeout', () => {
    let problem: ProblemDetail | null = null;

    http.get(URL).subscribe({ error: (error: ProblemDetail) => (problem = error) });
    httpMock.expectOne(URL).flush({}, { status: 503, statusText: 'Unavailable' });

    expect(problem).not.toBeNull();
    expect(problem!.code).not.toBe(TIMEOUT_ERROR_CODE);
  });
});
