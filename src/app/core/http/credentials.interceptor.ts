import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AppConfigService } from '../config/app-config.service';
import { isTrustedApiUrl } from '../utils/url.util';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(AppConfigService);

  if (!isTrustedApiUrl(req.url, config.apiBaseUrl())) {
    return next(req);
  }

  return next(req.clone({ withCredentials: true }));
};
