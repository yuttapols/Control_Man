import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AppConfigService } from '../config/app-config.service';
import { isTrustedApiUrl } from '../utils/url.util';

export const CORRELATION_HEADER = 'X-Correlation-Id';

export const correlationInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(AppConfigService);

  if (!isTrustedApiUrl(req.url, config.apiBaseUrl())) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { [CORRELATION_HEADER]: createCorrelationId() } }));
};

export function createCorrelationId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`;
}
