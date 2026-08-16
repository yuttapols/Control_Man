import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, TitleStrategy, provideRouter } from '@angular/router';

import { AppConfigService } from '../config/app-config.service';
import { AppTitleStrategy } from './app-title.strategy';
import { I18nService } from './i18n.service';

@Component({ template: '' })
class BlankPage {}

describe('AppTitleStrategy', () => {
  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'dashboard', title: 'route.dashboard', component: BlankPage },
          { path: 'nowhere', component: BlankPage },
        ]),
        { provide: TitleStrategy, useClass: AppTitleStrategy },
      ],
    });
  });

  it('resolves the router without a circular dependency', () => {
    expect(() => TestBed.inject(Router)).not.toThrow();
  });

  it('translates the route title and appends the application name', async () => {
    const router = TestBed.inject(Router);
    const appName = TestBed.inject(AppConfigService).appName();

    await router.navigateByUrl('/dashboard');
    TestBed.tick();

    expect(document.title).toBe(`ภาพรวม · ${appName}`);
  });

  it('retitles the current page when the language changes', async () => {
    const router = TestBed.inject(Router);
    const i18n = TestBed.inject(I18nService);
    const appName = TestBed.inject(AppConfigService).appName();

    await router.navigateByUrl('/dashboard');
    TestBed.tick();

    i18n.setLanguage('zh');
    TestBed.tick();

    expect(document.title).toBe(`总览 · ${appName}`);
  });

  it('falls back to the application name for a route without a title', async () => {
    const router = TestBed.inject(Router);
    const appName = TestBed.inject(AppConfigService).appName();

    await router.navigateByUrl('/nowhere');
    TestBed.tick();

    expect(document.title).toBe(appName);
  });
});
