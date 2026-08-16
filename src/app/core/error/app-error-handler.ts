import { ErrorHandler, Injectable, inject } from '@angular/core';

import { I18nService } from '../i18n/i18n.service';
import { NotificationService } from '../notification/notification.service';
import { isProblemDetail } from './problem-detail';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private readonly notifications = inject(NotificationService);
  private readonly i18n = inject(I18nService);

  handleError(error: unknown): void {
    if (isProblemDetail(error)) {
      return;
    }

    this.notifications.error(this.i18n.t('error.unhandled'));

    console.error(describe(error));
  }
}

function describe(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return 'Unhandled application error';
}
