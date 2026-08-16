import { TranslationKey } from '../../core/i18n/locales/th';
import { TranslationParams } from '../../core/i18n/i18n.service';

export interface ValidationMessage {
  key: TranslationKey;
  params?: TranslationParams;
  text?: string;
}

type ValidationMessageFactory = (error: unknown) => ValidationMessage;

interface LengthError {
  requiredLength: number;
}

interface RangeError {
  min?: number;
  max?: number;
}

interface ServerError {
  message: string;
}

const lengthOf = (error: unknown): number => (error as LengthError).requiredLength;

export const FALLBACK_VALIDATION_KEY: TranslationKey = 'validation.fallback';

export const VALIDATION_MESSAGES: Readonly<Record<string, ValidationMessageFactory>> = {
  required: () => ({ key: 'validation.required' }),
  requiredTrue: () => ({ key: 'validation.requiredTrue' }),
  notBlank: () => ({ key: 'validation.notBlank' }),
  email: () => ({ key: 'validation.email' }),
  username: () => ({ key: 'validation.username' }),
  minlength: (error) => ({ key: 'validation.minlength', params: { length: lengthOf(error) } }),
  maxlength: (error) => ({ key: 'validation.maxlength', params: { length: lengthOf(error) } }),
  maxTrimmedLength: (error) => ({
    key: 'validation.maxlength',
    params: { length: lengthOf(error) },
  }),
  min: (error) => ({ key: 'validation.min', params: { min: (error as RangeError).min ?? 0 } }),
  max: (error) => ({ key: 'validation.max', params: { max: (error as RangeError).max ?? 0 } }),
  pattern: () => ({ key: 'validation.pattern' }),
  isoDate: () => ({ key: 'validation.isoDate' }),
  httpUrl: () => ({ key: 'validation.httpUrl' }),
  match: () => ({ key: 'validation.match' }),
  serverError: (error) => ({
    key: FALLBACK_VALIDATION_KEY,
    text: (error as ServerError).message,
  }),
};

export function validationMessage(key: string, error: unknown): ValidationMessage {
  const factory = VALIDATION_MESSAGES[key];

  return factory ? factory(error) : { key: FALLBACK_VALIDATION_KEY };
}
