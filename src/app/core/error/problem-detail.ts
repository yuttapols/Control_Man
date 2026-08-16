import { HttpErrorResponse } from '@angular/common/http';

import { TranslationKey } from '../i18n/locales/th';
import { FieldError, ProblemDetail } from '../../shared/models/api.model';

export const NETWORK_ERROR_CODE = 'NETWORK_ERROR';
export const TIMEOUT_ERROR_CODE = 'TIMEOUT_ERROR';
export const UNKNOWN_ERROR_CODE = 'UNKNOWN_ERROR';

const STATUS_MESSAGE_KEYS: Readonly<Record<number, TranslationKey>> = {
  0: 'error.message.network',
  400: 'error.message.badRequest',
  401: 'error.message.unauthenticated',
  403: 'error.message.accessDenied',
  404: 'error.message.notFound',
  409: 'error.message.optimisticLock',
  422: 'error.message.businessRule',
  429: 'error.message.rateLimited',
  500: 'error.message.internal',
  503: 'error.message.dependencyUnavailable',
};

const FALLBACK_MESSAGE_KEY: TranslationKey = 'error.message.fallback';
const FALLBACK_TITLE_KEY: TranslationKey = 'error.title.fallback';

export const ERROR_CODES = {
  validation: 'VALIDATION_ERROR',
  unauthenticated: 'UNAUTHENTICATED',
  accessDenied: 'ACCESS_DENIED',
  notFound: 'NOT_FOUND',
  stateConflict: 'STATE_CONFLICT',
  optimisticLock: 'OPTIMISTIC_LOCK_CONFLICT',
  duplicate: 'DUPLICATE_RESOURCE',
  businessRule: 'BUSINESS_RULE_VIOLATION',
  rateLimited: 'RATE_LIMITED',
  internal: 'INTERNAL_ERROR',
  dependencyUnavailable: 'DEPENDENCY_UNAVAILABLE',
} as const;

const CODE_MESSAGE_KEYS: Readonly<Record<string, TranslationKey>> = {
  [ERROR_CODES.validation]: 'error.message.validation',
  [ERROR_CODES.unauthenticated]: 'error.message.unauthenticated',
  [ERROR_CODES.accessDenied]: 'error.message.accessDenied',
  [ERROR_CODES.notFound]: 'error.message.notFound',
  [ERROR_CODES.stateConflict]: 'error.message.stateConflict',
  [ERROR_CODES.optimisticLock]: 'error.message.optimisticLock',
  [ERROR_CODES.duplicate]: 'error.message.duplicate',
  [ERROR_CODES.businessRule]: 'error.message.businessRule',
  [ERROR_CODES.rateLimited]: 'error.message.rateLimited',
  [ERROR_CODES.internal]: 'error.message.internal',
  [ERROR_CODES.dependencyUnavailable]: 'error.message.dependencyUnavailable',
  [NETWORK_ERROR_CODE]: 'error.message.network',
  [TIMEOUT_ERROR_CODE]: 'error.message.timeout',
};

const CODE_TITLE_KEYS: Readonly<Record<string, TranslationKey>> = {
  [ERROR_CODES.validation]: 'error.title.validation',
  [ERROR_CODES.unauthenticated]: 'error.title.unauthenticated',
  [ERROR_CODES.accessDenied]: 'error.title.accessDenied',
  [ERROR_CODES.notFound]: 'error.title.notFound',
  [ERROR_CODES.stateConflict]: 'error.title.stateConflict',
  [ERROR_CODES.optimisticLock]: 'error.title.optimisticLock',
  [ERROR_CODES.duplicate]: 'error.title.duplicate',
  [ERROR_CODES.businessRule]: 'error.title.businessRule',
  [ERROR_CODES.rateLimited]: 'error.title.rateLimited',
  [ERROR_CODES.internal]: 'error.title.internal',
  [ERROR_CODES.dependencyUnavailable]: 'error.title.dependencyUnavailable',
  [NETWORK_ERROR_CODE]: 'error.title.network',
  [TIMEOUT_ERROR_CODE]: 'error.title.timeout',
};

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

export function problemDetailOverride(problem: ProblemDetail): string {
  return problem.code === ERROR_CODES.businessRule ? problem.detail : '';
}

export function problemMessageKey(problem: ProblemDetail): TranslationKey {
  return (
    CODE_MESSAGE_KEYS[problem.code] ??
    STATUS_MESSAGE_KEYS[problem.status] ??
    FALLBACK_MESSAGE_KEY
  );
}

export function problemTitleKey(problem: ProblemDetail): TranslationKey {
  return CODE_TITLE_KEYS[problem.code] ?? FALLBACK_TITLE_KEY;
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

export function buildProblemDetail(
  status: number,
  code: string,
  instance: string,
): ProblemDetail {
  return {
    type: 'about:blank',
    title: '',
    status,
    code,
    detail: '',
    instance,
    requestId: '',
  };
}
