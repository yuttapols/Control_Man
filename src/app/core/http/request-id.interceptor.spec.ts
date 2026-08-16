import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { REQUEST_ID_HEADER, createRequestId, requestIdInterceptor } from './request-id.interceptor';

const PORTAL_URL = '/api/v1/portal/holidays';
const EXTERNAL_URL = 'https://third-party.example/data';

const BACKEND_ALLOWED_HEADERS = ['Authorization', 'Content-Type', 'X-Request-ID', 'X-CSRF-Token'];

describe('requestIdInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([requestIdInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('uses a header name the backend cors policy allows', () => {
    const allowed = BACKEND_ALLOWED_HEADERS.map((header) => header.toLowerCase());

    expect(allowed).toContain(REQUEST_ID_HEADER.toLowerCase());
  });

  it('tags portal requests so the backend echoes the same id back', () => {
    http.get(PORTAL_URL).subscribe();

    const request = httpMock.expectOne(PORTAL_URL);

    expect(request.request.headers.get(REQUEST_ID_HEADER)).toMatch(/^[A-Za-z0-9_.:-]{1,64}$/);
    request.flush({});
  });

  it('leaves requests to other origins untouched', () => {
    http.get(EXTERNAL_URL).subscribe();

    const request = httpMock.expectOne(EXTERNAL_URL);

    expect(request.request.headers.has(REQUEST_ID_HEADER)).toBe(false);
    request.flush({});
  });

  it('generates ids the backend accepts instead of replacing', () => {
    const ids = Array.from({ length: 20 }, () => createRequestId());

    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^[A-Za-z0-9_.:-]{1,64}$/));
  });
});
