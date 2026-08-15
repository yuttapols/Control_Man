import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        providePrimeNG({ theme: { preset: Aura } }),
        MessageService,
      ],
    }).compileComponents();
  });

  it('creates the application root', () => {
    const fixture = TestBed.createComponent(App);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('hides the configuration warning while the runtime config is healthy', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('[role="alert"]')).toBeNull();
  });
});
