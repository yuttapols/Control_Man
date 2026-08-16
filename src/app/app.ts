import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';

import { AppConfigService } from './core/config/app-config.service';
import { I18nService } from './core/i18n/i18n.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Toast],
  template: `
    @if (configLoadFailed()) {
      <div
        role="alert"
        class="flex items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-sm text-amber-900"
      >
        <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
        {{ i18n.t('app.configLoadFailed') }}
      </div>
    }

    <router-outlet />
    <p-toast position="top-right" />
  `,
})
export class App {
  private readonly config = inject(AppConfigService);
  protected readonly i18n = inject(I18nService);

  readonly configLoadFailed = computed(() => this.config.configLoadFailed());
}
