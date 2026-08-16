import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AppConfigService } from '../config/app-config.service';
import { isTrustedApiUrl } from '../utils/url.util';

export const REQUEST_ID_HEADER = 'X-Request-Id';

const SAFE_REQUEST_ID = /^[A-Za-z0-9_.:-]{1,64}$/;

export const requestIdInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(AppConfigService);

  if (!isTrustedApiUrl(req.url, config.apiBaseUrl())) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { [REQUEST_ID_HEADER]: createRequestId() } }));
};

export function createRequestId(): string {
  const candidate =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`;

  return SAFE_REQUEST_ID.test(candidate) ? candidate : candidate.replace(/[^A-Za-z0-9_.:-]/g, '');
}
