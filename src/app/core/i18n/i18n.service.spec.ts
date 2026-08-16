import { TestBed } from '@angular/core/testing';

import { ProblemDetail } from '../../shared/models/api.model';
import { ERROR_CODES } from '../error/problem-detail';
import { I18nService } from './i18n.service';
import { LANGUAGE_OPTIONS } from './language.model';
import { EN } from './locales/en';
import { TH } from './locales/th';
import { ZH } from './locales/zh';

function problemWith(overrides: Partial<ProblemDetail>): ProblemDetail {
  return {
    type: 'about:blank',
    title: 'Validation failed',
    status: 400,
    code: ERROR_CODES.validation,
    detail: '',
    instance: '/api/v1/portal/holidays',
    requestId: 'req-1',
    ...overrides,
  };
}

describe('I18nService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('covers every key in all three languages with no blank entries', () => {
    const keys = Object.keys(TH);

    for (const dictionary of [EN, ZH]) {
      expect(Object.keys(dictionary).sort()).toEqual(keys.sort());
    }

    for (const dictionary of [TH, EN, ZH]) {
      const blank = Object.entries(dictionary).filter(([, value]) => value.trim().length === 0);

      expect(blank).toEqual([]);
    }
  });

  it('keeps interpolation placeholders identical across languages', () => {
    const placeholders = (value: string) => (value.match(/\{(\w+)\}/g) ?? []).sort();

    for (const key of Object.keys(TH) as (keyof typeof TH)[]) {
      expect(placeholders(EN[key])).toEqual(placeholders(TH[key]));
      expect(placeholders(ZH[key])).toEqual(placeholders(TH[key]));
    }
  });

  it('defaults to Thai and switches language at runtime', () => {
    const i18n = TestBed.inject(I18nService);

    expect(i18n.language()).toBe('th');
    expect(i18n.t('nav.dashboard')).toBe('ภาพรวม');

    i18n.setLanguage('zh');

    expect(i18n.t('nav.dashboard')).toBe('总览');
    expect(document.documentElement.lang).toBe('zh-Hans');

    i18n.setLanguage('en');

    expect(i18n.t('nav.dashboard')).toBe('Overview');
  });

  it('persists the chosen language so a reload keeps it', () => {
    TestBed.inject(I18nService).setLanguage('zh');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    expect(TestBed.inject(I18nService).language()).toBe('zh');
  });

  it('interpolates named parameters and leaves unknown ones untouched', () => {
    const i18n = TestBed.inject(I18nService);

    expect(i18n.t('dashboard.greeting', { name: 'สมชาย' })).toBe('ยินดีต้อนรับ สมชาย');
    expect(i18n.t('dashboard.greeting')).toBe('ยินดีต้อนรับ {name}');
  });

  it('translates problem messages by code and follows the active language', () => {
    const i18n = TestBed.inject(I18nService);
    const problem = problemWith({ status: 403, code: ERROR_CODES.accessDenied });

    expect(i18n.problemTitle(problem)).toBe('ไม่มีสิทธิ์ดำเนินการ');

    i18n.setLanguage('en');

    expect(i18n.problemTitle(problem)).toBe('Not permitted');
    expect(i18n.problemMessage(problem)).toContain('do not have permission');
  });

  it('keeps the backend business rule detail instead of a translated message', () => {
    const i18n = TestBed.inject(I18nService);
    const problem = problemWith({
      status: 422,
      code: ERROR_CODES.businessRule,
      detail: 'Submitter cannot approve their own revision',
    });

    expect(i18n.problemMessage(problem)).toBe('Submitter cannot approve their own revision');
  });

  it('falls back to Thai when the stored language is not supported', () => {
    localStorage.setItem('thc.language', 'ja');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    expect(TestBed.inject(I18nService).language()).toBe('th');
  });

  it('exposes one locale per supported language', () => {
    expect(LANGUAGE_OPTIONS.map((option) => option.code)).toEqual(['th', 'en', 'zh']);
  });
});
