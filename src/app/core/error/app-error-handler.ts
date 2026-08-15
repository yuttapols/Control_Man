import { ErrorHandler, Injectable, inject } from '@angular/core';

import { isProblemDetail, problemMessage } from './problem-detail';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private readonly notifications = inject(NotificationService);

  handleError(error: unknown): void {
    if (isProblemDetail(error)) {
      return;
    }

    this.notifications.error(
      'ระบบทำงานผิดพลาดโดยไม่คาดคิด กรุณาลองใหม่ หากยังพบปัญหาให้ติดต่อผู้ดูแลระบบ',
    );

    console.error(describe(error));
  }
}

function describe(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  if (isProblemDetail(error)) {
    return problemMessage(error);
  }

  return 'Unhandled application error';
}
