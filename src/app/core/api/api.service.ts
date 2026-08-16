import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiResponse, EMPTY_PAGE, PagedResult, QueryParams } from '../../shared/models/api.model';
import { AppConfigService } from '../config/app-config.service';
import { httpContextFor } from '../http/http-context';
import { joinUrl } from '../utils/url.util';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
  query?: QueryParams;
  timeoutMs?: number;
  skipLoading?: boolean;
  withCredentials?: boolean;
}

interface DispatchOptions extends ApiRequestOptions {
  body?: unknown;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  get<T>(path: string, options: ApiRequestOptions = {}): Observable<T> {
    return this.dispatch<ApiResponse<T>>('GET', path, options).pipe(map(unwrap));
  }

  getPaged<T>(path: string, options: ApiRequestOptions = {}): Observable<PagedResult<T>> {
    return this.dispatch<ApiResponse<T[]>>('GET', path, options).pipe(
      map((response) => ({
        items: response.data,
        page: response.meta.page ?? EMPTY_PAGE,
      })),
    );
  }

  post<T>(path: string, body?: unknown, options: ApiRequestOptions = {}): Observable<T> {
    return this.dispatch<ApiResponse<T>>('POST', path, { ...options, body: body ?? {} }).pipe(
      map(unwrap),
    );
  }

  put<T>(path: string, body: unknown, options: ApiRequestOptions = {}): Observable<T> {
    return this.dispatch<ApiResponse<T>>('PUT', path, { ...options, body }).pipe(map(unwrap));
  }

  patch<T>(path: string, body: unknown, options: ApiRequestOptions = {}): Observable<T> {
    return this.dispatch<ApiResponse<T>>('PATCH', path, { ...options, body }).pipe(map(unwrap));
  }

  delete<T>(path: string, options: ApiRequestOptions = {}): Observable<T> {
    return this.dispatch<ApiResponse<T>>('DELETE', path, options).pipe(map(unwrap));
  }

  url(path: string): string {
    return joinUrl(this.config.apiBaseUrl(), path);
  }

  private dispatch<T>(method: HttpMethod, path: string, options: DispatchOptions): Observable<T> {
    return this.http.request<T>(method, this.url(path), {
      body: options.body,
      params: toHttpParams(options.query),
      context: httpContextFor({
        skipLoading: options.skipLoading,
        timeoutMs: options.timeoutMs,
      }),
      withCredentials: options.withCredentials ?? false,
    });
  }
}

function unwrap<T>(response: ApiResponse<T>): T {
  return response.data;
}

export function toHttpParams(query?: QueryParams): HttpParams {
  let params = new HttpParams();

  if (!query) {
    return params;
  }

  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        params = params.set(key, value.join(','));
      }
      continue;
    }

    params = params.set(key, String(value));
  }

  return params;
}
