import { AbstractControl, FormGroup } from '@angular/forms';

import { FieldError, ProblemDetail } from '../models/api.model';
import { validationMessage } from './validation-messages';

export const SERVER_ERROR_KEY = 'serverError';

export interface FormErrorItem {
  field: string;
  label: string;
  message: string;
}

export function controlErrorText(control: AbstractControl | null | undefined): string | null {
  if (!control || !control.errors || !isControlVisible(control)) {
    return null;
  }

  const serverError = control.errors[SERVER_ERROR_KEY];

  if (serverError) {
    return validationMessage(SERVER_ERROR_KEY, serverError);
  }

  const [key, error] = Object.entries(control.errors)[0];

  return validationMessage(key, error);
}

export function isControlVisible(control: AbstractControl): boolean {
  return control.invalid && (control.touched || control.dirty);
}

export function markAllControlsTouched(form: FormGroup): void {
  form.markAllAsTouched();
  form.updateValueAndValidity({ emitEvent: false });
}

export function formErrorSummary(
  form: FormGroup,
  labels: Readonly<Record<string, string>> = {},
): FormErrorItem[] {
  const summary: FormErrorItem[] = [];

  for (const [field, control] of Object.entries(form.controls)) {
    const message = controlErrorText(control);

    if (message) {
      summary.push({ field, label: labels[field] ?? field, message });
    }
  }

  return summary;
}

export function applyServerFieldErrors(form: FormGroup, problem: ProblemDetail): FieldError[] {
  const unmapped: FieldError[] = [];

  for (const fieldError of problem.errors ?? []) {
    const control = form.get(fieldError.field);

    if (control) {
      control.setErrors({ ...(control.errors ?? {}), [SERVER_ERROR_KEY]: { message: fieldError.message } });
      control.markAsTouched();
      continue;
    }

    unmapped.push(fieldError);
  }

  return unmapped;
}

export function clearServerFieldErrors(form: FormGroup): void {
  for (const control of Object.values(form.controls)) {
    if (!control.errors || !(SERVER_ERROR_KEY in control.errors)) {
      continue;
    }

    const remaining = { ...control.errors };
    delete remaining[SERVER_ERROR_KEY];

    control.setErrors(Object.keys(remaining).length > 0 ? remaining : null);
  }
}
