import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { httpContextFor } from './http-context';
import { loadingInterceptor } from './loading.interceptor';
import { LoadingStore } from './loading.store';

const URL_A = '/api/v1/portal/holidays';
const URL_B = '/api/v1/portal/approvals';

describe('loadingInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let loading: LoadingStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    loading = TestBed.inject(LoadingStore);
  });

  afterEach(() => httpMock.verify());

  it('stays busy until the last concurrent request settles', () => {
    http.get(URL_A).subscribe();
    http.get(URL_B).subscribe();

    expect(loading.pendingCount()).toBe(2);
    expect(loading.busy()).toBe(true);

    httpMock.expectOne(URL_A).flush({});

    expect(loading.busy()).toBe(true);

    httpMock.expectOne(URL_B).flush({});

    expect(loading.pendingCount()).toBe(0);
    expect(loading.busy()).toBe(false);
  });

  it('clears the counter when a request fails', () => {
    http.get(URL_A).subscribe({ error: () => undefined });

    expect(loading.busy()).toBe(true);

    httpMock.expectOne(URL_A).flush({}, { status: 500, statusText: 'Server Error' });

    expect(loading.pendingCount()).toBe(0);
  });

  it('clears the counter when a request is cancelled', () => {
    const subscription = http.get(URL_A).subscribe();

    expect(loading.busy()).toBe(true);

    subscription.unsubscribe();

    expect(loading.pendingCount()).toBe(0);
    httpMock.expectOne(URL_A);
  });

  it('leaves the spinner alone for requests that opt out', () => {
    http.get(URL_A, { context: httpContextFor({ skipLoading: true }) }).subscribe();

    expect(loading.busy()).toBe(false);

    httpMock.expectOne(URL_A).flush({});
  });

  it('routes the spinner into the modal while one is open', () => {
    http.get(URL_A).subscribe();

    expect(loading.pageBusy()).toBe(true);
    expect(loading.modalBusy()).toBe(false);

    loading.registerModal();

    expect(loading.pageBusy()).toBe(false);
    expect(loading.modalBusy()).toBe(true);

    loading.releaseModal();

    expect(loading.pageBusy()).toBe(true);

    httpMock.expectOne(URL_A).flush({});
  });

  it('never lets the counter fall below zero', () => {
    loading.endRequest();
    loading.releaseModal();

    expect(loading.pendingCount()).toBe(0);
    expect(loading.modalOpen()).toBe(false);
  });
});
