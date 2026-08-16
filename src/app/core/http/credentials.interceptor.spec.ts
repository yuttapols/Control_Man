import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { credentialsInterceptor } from './credentials.interceptor';

const PORTAL_URL = '/api/v1/portal/holidays';
const EXTERNAL_URL = 'https://third-party.example/data';

describe('credentialsInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([credentialsInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('includes credentials for trusted API requests', () => {
    http.get(PORTAL_URL).subscribe();

    const request = httpMock.expectOne(PORTAL_URL);
    expect(request.request.withCredentials).toBe(true);
    request.flush({});
  });

  it('does not include credentials for external requests', () => {
    http.get(EXTERNAL_URL).subscribe();

    const request = httpMock.expectOne(EXTERNAL_URL);
    expect(request.request.withCredentials).toBe(false);
    request.flush({});
  });
});
