import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

import { ProblemDetail } from '../../shared/models/api.model';
import { I18nService } from '../i18n/i18n.service';

const SUCCESS_LIFE = 4000;
const ERROR_LIFE = 8000;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly messages = inject(MessageService);
  private readonly i18n = inject(I18nService);

  success(detail: string, summary = ''): void {
    this.messages.add({
      severity: 'success',
      summary: summary || this.i18n.t('notify.success'),
      detail,
      life: SUCCESS_LIFE,
    });
  }

  info(detail: string, summary = ''): void {
    this.messages.add({
      severity: 'info',
      summary: summary || this.i18n.t('notify.info'),
      detail,
      life: SUCCESS_LIFE,
    });
  }

  warn(detail: string, summary = ''): void {
    this.messages.add({
      severity: 'warn',
      summary: summary || this.i18n.t('notify.warn'),
      detail,
      life: ERROR_LIFE,
    });
  }

  error(detail: string, summary = ''): void {
    this.messages.add({
      severity: 'error',
      summary: summary || this.i18n.t('notify.error'),
      detail,
      life: ERROR_LIFE,
    });
  }

  problem(problem: ProblemDetail): void {
    const reference = problem.requestId
      ? this.i18n.t('notify.reference', { id: problem.requestId })
      : '';

    this.messages.add({
      severity: 'error',
      summary: this.i18n.problemTitle(problem),
      detail: `${this.i18n.problemMessage(problem)}${reference}`,
      life: ERROR_LIFE,
    });
  }

  clear(): void {
    this.messages.clear();
  }
}
