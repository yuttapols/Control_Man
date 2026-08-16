import { Injectable, computed, signal } from '@angular/core';

import {
  problemDetailOverride,
  problemMessageKey,
  problemTitleKey,
} from '../error/problem-detail';
import { ProblemDetail } from '../../shared/models/api.model';
import { AppLanguage, DEFAULT_LANGUAGE, isAppLanguage, localeOf } from './language.model';
import { EN } from './locales/en';
import { TH, TranslationKey } from './locales/th';
import { ZH } from './locales/zh';

export type TranslationParams = Readonly<Record<string, string | number>>;

const LANGUAGE_KEY = 'thc.language';

const DICTIONARIES: Readonly<Record<AppLanguage, Readonly<Record<TranslationKey, string>>>> = {
  th: TH,
  en: EN,
  zh: ZH,
};

export function readStoredLanguage(): AppLanguage {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);

    return isAppLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function interpolate(template: string, params: TranslationParams): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly current = signal<AppLanguage>(readStoredLanguage());
  private readonly dictionary = computed(() => DICTIONARIES[this.current()]);

  readonly language = this.current.asReadonly();
  readonly locale = computed(() => localeOf(this.current()));

  constructor() {
    this.applyDocumentLanguage(this.current());
  }

  t(key: TranslationKey, params?: TranslationParams): string {
    const template = this.dictionary()[key];

    return params ? interpolate(template, params) : template;
  }

  problemMessage(problem: ProblemDetail): string {
    return problemDetailOverride(problem) || this.t(problemMessageKey(problem));
  }

  problemTitle(problem: ProblemDetail): string {
    return this.t(problemTitleKey(problem));
  }

  setLanguage(language: AppLanguage): void {
    if (language === this.current()) {
      return;
    }

    this.current.set(language);
    this.applyDocumentLanguage(language);

    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
      return;
    }
  }

  private applyDocumentLanguage(language: AppLanguage): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = localeOf(language);
    }
  }
}
