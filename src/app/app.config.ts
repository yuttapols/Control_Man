import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { TitleStrategy, provideRouter, withInMemoryScrolling } from '@angular/router';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { AuthService } from './core/auth/auth.service';
import { AppConfigService } from './core/config/app-config.service';
import { AppErrorHandler } from './core/error/app-error-handler';
import { AppTitleStrategy } from './core/i18n/app-title.strategy';
import { authInterceptor } from './core/http/auth.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';
import { requestIdInterceptor } from './core/http/request-id.interceptor';
import { mockApiInterceptor } from './core/mock/mock-api.interceptor';
import { AppPreset } from './core/theme/app-preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(
      withInterceptors([
        requestIdInterceptor,
        errorInterceptor,
        authInterceptor,
        mockApiInterceptor,
      ]),
    ),
    providePrimeNG({
      ripple: true,
      overlayAppendTo: 'body',
      theme: {
        preset: AppPreset,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: { name: 'primeng', order: 'theme, base, primeng' },
        },
      },
    }),
    MessageService,
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    provideAppInitializer(async () => {
      const config = inject(AppConfigService);
      const auth = inject(AuthService);

      await config.load();
      await firstValueFrom(auth.restoreSession());
    }),
  ],
};
