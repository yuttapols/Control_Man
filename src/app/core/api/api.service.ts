import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  ApiResponse,
  EMPTY_PAGE,
  PagedResult,
  QueryParams,
} from '../../shared/models/api.model';
import { AppConfigService } from '../config/app-config.service';
import { joinUrl } from '../utils/url.util';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  get<T>(path: string, query?: QueryParams): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(this.url(path), { params: toHttpParams(query) })
      .pipe(map(unwrap));
  }

  getPaged<T>(path: string, query?: QueryParams): Observable<PagedResult<T>> {
    return this.http.get<ApiResponse<T[]>>(this.url(path), { params: toHttpParams(query) }).pipe(
      map((response) => ({
        items: response.data,
        page: response.meta.page ?? EMPTY_PAGE,
      })),
    );
  }

  post<T>(path: string, body?: unknown): Observable<T> {
    return this.http.post<ApiResponse<T>>(this.url(path), body ?? {}).pipe(map(unwrap));
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<ApiResponse<T>>(this.url(path), body).pipe(map(unwrap));
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<ApiResponse<T>>(this.url(path), body).pipe(map(unwrap));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(this.url(path)).pipe(map(unwrap));
  }

  url(path: string): string {
    return joinUrl(this.config.apiBaseUrl(), path);
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
