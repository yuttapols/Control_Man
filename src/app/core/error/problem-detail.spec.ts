import { HttpErrorResponse } from '@angular/common/http';

import { ProblemDetail } from '../../shared/models/api.model';
import {
  ERROR_CODES,
  isConflictError,
  isNotifiableError,
  problemDetailOverride,
  problemMessageKey,
  problemTitleKey,
  toProblemDetail,
} from './problem-detail';

function backendProblem(overrides: Partial<ProblemDetail>): ProblemDetail {
  return {
    type: 'https://errors.control-m/validation_error',
    title: 'Validation failed',
    status: 400,
    code: ERROR_CODES.validation,
    detail: 'One or more fields are invalid',
    instance: '/api/v1/portal/auth/login',
    requestId: '9b1c3d2e',
    errors: [],
    ...overrides,
  };
}

describe('problem detail', () => {
  it('unwraps the backend problem body from an HttpErrorResponse', () => {
    const body = backendProblem({
      status: 401,
      code: ERROR_CODES.unauthenticated,
      detail: 'Invalid username or password',
      title: 'Authentication required',
    });

    const problem = toProblemDetail(
      new HttpErrorResponse({ status: 401, error: body, url: '/api/v1/portal/auth/login' }),
    );

    expect(problem.code).toBe(ERROR_CODES.unauthenticated);
    expect(problem.requestId).toBe('9b1c3d2e');
  });

  it('binds the message to the error code, not to the http status', () => {
    expect(problemMessageKey(backendProblem({}))).toBe('error.message.validation');
    expect(
      problemMessageKey(backendProblem({ status: 409, code: ERROR_CODES.optimisticLock })),
    ).toBe('error.message.optimisticLock');
    expect(problemMessageKey(backendProblem({ status: 409, code: ERROR_CODES.duplicate }))).toBe(
      'error.message.duplicate',
    );
  });

  it('never shows the english backend title to the user', () => {
    expect(problemTitleKey(backendProblem({}))).toBe('error.title.validation');
    expect(problemTitleKey(backendProblem({ code: 'SOMETHING_NEW' }))).toBe('error.title.fallback');
  });

  it('keeps the business rule detail because it carries the actual reason', () => {
    const problem = backendProblem({
      status: 422,
      code: ERROR_CODES.businessRule,
      detail: 'ผู้สร้างรายการอนุมัติรายการของตนเองไม่ได้',
    });

    expect(problemDetailOverride(problem)).toBe('ผู้สร้างรายการอนุมัติรายการของตนเองไม่ได้');
  });

  it('treats a failed connection as a network problem', () => {
    const problem = toProblemDetail(
      new HttpErrorResponse({ status: 0, url: '/api/v1/portal/auth/me' }),
    );

    expect(problemMessageKey(problem)).toBe('error.message.network');
    expect(isNotifiableError(problem)).toBe(true);
  });

  it('notifies only for failures the user cannot fix inline', () => {
    expect(isNotifiableError(backendProblem({ status: 500, code: ERROR_CODES.internal }))).toBe(
      true,
    );
    expect(isNotifiableError(backendProblem({ status: 429, code: ERROR_CODES.rateLimited }))).toBe(
      true,
    );
    expect(isNotifiableError(backendProblem({}))).toBe(false);
    expect(
      isNotifiableError(backendProblem({ status: 403, code: ERROR_CODES.accessDenied })),
    ).toBe(false);
  });

  it('flags conflicts so pages can offer reload or compare', () => {
    expect(
      isConflictError(backendProblem({ status: 409, code: ERROR_CODES.stateConflict })),
    ).toBe(true);
    expect(isConflictError(backendProblem({}))).toBe(false);
  });
});
