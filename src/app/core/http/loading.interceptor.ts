import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { SKIP_LOADING } from './http-context';
import { LoadingStore } from './loading.store';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_LOADING)) {
    return next(req);
  }

  const loading = inject(LoadingStore);

  loading.startRequest();

  return next(req).pipe(finalize(() => loading.endRequest()));
};
