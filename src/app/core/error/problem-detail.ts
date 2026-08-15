import { HttpErrorResponse } from '@angular/common/http';

import { FieldError, ProblemDetail } from '../../shared/models/api.model';

export const NETWORK_ERROR_CODE = 'NETWORK_ERROR';
export const UNKNOWN_ERROR_CODE = 'UNKNOWN_ERROR';

const STATUS_MESSAGES: Readonly<Record<number, string>> = {
  0: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่',
  400: 'ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบแล้วลองใหม่',
  401: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง',
  403: 'คุณไม่มีสิทธิ์ดำเนินการนี้ กรุณาติดต่อผู้ดูแลระบบ',
  404: 'ไม่พบข้อมูลที่ต้องการ',
  409: 'ข้อมูลถูกแก้ไขโดยผู้ใช้อื่นแล้ว กรุณาโหลดข้อมูลใหม่ก่อนบันทึก',
  422: 'ไม่สามารถดำเนินการได้เพราะขัดกับเงื่อนไขทางธุรกิจ',
  429: 'มีการเรียกใช้งานถี่เกินกำหนด กรุณารอสักครู่แล้วลองใหม่',
  500: 'ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง',
  503: 'ระบบไม่พร้อมให้บริการชั่วคราว กรุณาลองใหม่ภายหลัง',
};

const FALLBACK_MESSAGE = 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง';

export function isProblemDetail(value: unknown): value is ProblemDetail {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<ProblemDetail>;

  return typeof candidate.status === 'number' && typeof candidate.code === 'string';
}

export function toProblemDetail(error: unknown): ProblemDetail {
  if (isProblemDetail(error)) {
    return error;
  }

  if (error instanceof HttpErrorResponse) {
    if (isProblemDetail(error.error)) {
      return error.error;
    }

    return buildProblemDetail(
      error.status,
      error.status === 0 ? NETWORK_ERROR_CODE : UNKNOWN_ERROR_CODE,
      error.url ?? '',
    );
  }

  return buildProblemDetail(0, UNKNOWN_ERROR_CODE, '');
}

export function problemMessage(problem: ProblemDetail): string {
  if (problem.detail && problem.code !== UNKNOWN_ERROR_CODE && problem.code !== NETWORK_ERROR_CODE) {
    return problem.detail;
  }

  return STATUS_MESSAGES[problem.status] ?? FALLBACK_MESSAGE;
}

export function problemTitle(problem: ProblemDetail): string {
  return problem.title || STATUS_MESSAGES[problem.status] || FALLBACK_MESSAGE;
}

export function fieldErrorsOf(problem: ProblemDetail): readonly FieldError[] {
  return problem.errors ?? [];
}

export function isAuthenticationError(problem: ProblemDetail): boolean {
  return problem.status === 401;
}

export function isForbiddenError(problem: ProblemDetail): boolean {
  return problem.status === 403;
}

export function isConflictError(problem: ProblemDetail): boolean {
  return problem.status === 409;
}

export function isNotifiableError(problem: ProblemDetail): boolean {
  return problem.status === 0 || problem.status === 429 || problem.status >= 500;
}

function buildProblemDetail(status: number, code: string, instance: string): ProblemDetail {
  return {
    type: 'about:blank',
    title: STATUS_MESSAGES[status] ?? FALLBACK_MESSAGE,
    status,
    code,
    detail: '',
    instance,
    requestId: '',
  };
}
