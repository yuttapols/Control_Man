import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ProblemDetail } from '../models/api.model';
import { AppValidators } from './app-validators';
import {
  applyServerFieldErrors,
  clearServerFieldErrors,
  controlErrorMessage,
  formErrorSummary,
  markAllControlsTouched,
} from './form-error.util';

function buildForm(): FormGroup {
  return new FormGroup({
    username: new FormControl('', [Validators.required, AppValidators.username()]),
    sourceUrl: new FormControl('', [AppValidators.httpUrl()]),
  });
}

function problemWith(errors: ProblemDetail['errors']): ProblemDetail {
  return {
    type: 'about:blank',
    title: 'Validation failed',
    status: 400,
    code: 'VALIDATION_ERROR',
    detail: 'One or more fields are invalid',
    instance: '/api/v1/portal/holidays',
    requestId: 'req-1',
    errors,
  };
}

describe('form error util', () => {
  it('hides messages until the control is touched or dirty', () => {
    const form = buildForm();

    expect(controlErrorMessage(form.controls['username'])).toBeNull();

    markAllControlsTouched(form);

    expect(controlErrorMessage(form.controls['username'])?.key).toBe('validation.required');
  });

  it('reports one message per invalid control in the summary', () => {
    const form = buildForm();
    form.patchValue({ username: 'ab cd', sourceUrl: 'javascript:alert(1)' });
    markAllControlsTouched(form);

    const summary = formErrorSummary(form, {
      username: 'login.username',
      sourceUrl: 'login.password',
    });

    expect(summary.map((item) => item.labelKey)).toEqual(['login.username', 'login.password']);
    expect(summary[1].message.key).toBe('validation.httpUrl');
  });

  it('maps server field errors onto matching controls', () => {
    const form = buildForm();
    const unmapped = applyServerFieldErrors(
      form,
      problemWith([
        { field: 'username', code: 'DUPLICATE', message: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' },
        { field: 'unknownField', code: 'REQUIRED', message: 'ไม่รู้จักฟิลด์นี้' },
      ]),
    );

    expect(controlErrorMessage(form.controls['username'])?.text).toBe('ชื่อผู้ใช้นี้ถูกใช้แล้ว');
    expect(unmapped.map((item) => item.field)).toEqual(['unknownField']);
  });

  it('clears server errors without dropping client validators', () => {
    const form = buildForm();
    applyServerFieldErrors(
      form,
      problemWith([{ field: 'username', code: 'DUPLICATE', message: 'ซ้ำ' }]),
    );

    clearServerFieldErrors(form);

    expect(controlErrorMessage(form.controls['username'])?.key).toBe('validation.required');
  });
});
