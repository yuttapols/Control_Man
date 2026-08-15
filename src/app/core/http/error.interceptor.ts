import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { isNotifiableError, toProblemDetail } from '../error/problem-detail';
import { NotificationService } from '../notification/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      const problem = toProblemDetail(error);

      if (isNotifiableError(problem)) {
        notifications.problem(problem);
      }

      return throwError(() => problem);
    }),
  );
};
