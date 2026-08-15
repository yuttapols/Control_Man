import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { AuthService } from './core/auth/auth.service';
import { AppConfigService } from './core/config/app-config.service';
import { AppErrorHandler } from './core/error/app-error-handler';
import { authInterceptor } from './core/http/auth.interceptor';
import { correlationInterceptor } from './core/http/correlation.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';
import { mockApiInterceptor } from './core/mock/mock-api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(
      withInterceptors([
        correlationInterceptor,
        errorInterceptor,
        authInterceptor,
        mockApiInterceptor,
      ]),
    ),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: { name: 'primeng', order: 'theme, base, primeng' },
        },
      },
    }),
    MessageService,
    { provide: ErrorHandler, useClass: AppErrorHandler },
    provideAppInitializer(async () => {
      const config = inject(AppConfigService);
      const auth = inject(AuthService);

      await config.load();
      await firstValueFrom(auth.restoreSession());
    }),
  ],
};
