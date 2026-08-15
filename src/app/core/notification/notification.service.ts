import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

import { ProblemDetail } from '../../shared/models/api.model';
import { problemMessage, problemTitle } from '../error/problem-detail';

const SUCCESS_LIFE = 4000;
const ERROR_LIFE = 8000;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly messages = inject(MessageService);

  success(detail: string, summary = 'สำเร็จ'): void {
    this.messages.add({ severity: 'success', summary, detail, life: SUCCESS_LIFE });
  }

  info(detail: string, summary = 'ข้อมูล'): void {
    this.messages.add({ severity: 'info', summary, detail, life: SUCCESS_LIFE });
  }

  warn(detail: string, summary = 'คำเตือน'): void {
    this.messages.add({ severity: 'warn', summary, detail, life: ERROR_LIFE });
  }

  error(detail: string, summary = 'เกิดข้อผิดพลาด'): void {
    this.messages.add({ severity: 'error', summary, detail, life: ERROR_LIFE });
  }

  problem(problem: ProblemDetail): void {
    const reference = problem.requestId ? ` (รหัสอ้างอิง: ${problem.requestId})` : '';

    this.messages.add({
      severity: 'error',
      summary: problemTitle(problem),
      detail: `${problemMessage(problem)}${reference}`,
      life: ERROR_LIFE,
    });
  }

  clear(): void {
    this.messages.clear();
  }
}
