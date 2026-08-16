import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TimeoutError, catchError, throwError, timeout } from 'rxjs';

import { AppConfigService } from '../config/app-config.service';
import { TIMEOUT_ERROR_CODE, buildProblemDetail } from '../error/problem-detail';
import { REQUEST_TIMEOUT_MS } from './http-context';

export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(AppConfigService);
  const requested = req.context.get(REQUEST_TIMEOUT_MS);
  const limit = requested > 0 ? requested : config.apiTimeoutMs();

  if (limit <= 0) {
    return next(req);
  }

  return next(req).pipe(
    timeout({ each: limit }),
    catchError((error: unknown) =>
      throwError(() =>
        error instanceof TimeoutError ? buildProblemDetail(0, TIMEOUT_ERROR_CODE, req.url) : error,
      ),
    ),
  );
};
