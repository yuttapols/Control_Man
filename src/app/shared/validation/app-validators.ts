import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { isSafeExternalUrl } from '../../core/utils/url.util';

const USERNAME_PATTERN = /^[A-Za-z0-9._@-]{3,100}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const PASSWORD_MIN_LENGTH = 8;

function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

export const AppValidators = {
  notBlank(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (typeof value !== 'string' || isEmptyValue(value)) {
        return null;
      }

      return value.trim().length === 0 ? { notBlank: true } : null;
    };
  },

  username(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (isEmptyValue(value)) {
        return null;
      }

      return USERNAME_PATTERN.test(String(value).trim()) ? null : { username: true };
    };
  },

  password(): ValidatorFn {
    return Validators.minLength(PASSWORD_MIN_LENGTH);
  },

  isoDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (isEmptyValue(value)) {
        return null;
      }

      const text = String(value);

      if (!ISO_DATE_PATTERN.test(text) || Number.isNaN(Date.parse(text))) {
        return { isoDate: true };
      }

      return null;
    };
  },

  httpUrl(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (isEmptyValue(value)) {
        return null;
      }

      return isSafeExternalUrl(String(value)) ? null : { httpUrl: true };
    };
  },

  maxTrimmedLength(limit: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (isEmptyValue(value)) {
        return null;
      }

      const length = String(value).trim().length;

      return length > limit ? { maxTrimmedLength: { requiredLength: limit, actualLength: length } } : null;
    };
  },

  match(sourceControlName: string, targetControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const source = group.get(sourceControlName);
      const target = group.get(targetControlName);

      if (!source || !target || isEmptyValue(target.value)) {
        return null;
      }

      return source.value === target.value ? null : { match: { targetControlName } };
    };
  },
};
