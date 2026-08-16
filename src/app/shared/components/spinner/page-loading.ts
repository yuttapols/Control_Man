import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { LoadingStore } from '../../../core/http/loading.store';
import { I18nService } from '../../../core/i18n/i18n.service';
import { AppSpinner } from './app-spinner';

@Component({
  selector: 'app-page-loading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppSpinner],
  template: `
    @if (visible()) {
      <div
        class="app-page-loading fixed inset-0 flex items-center justify-center bg-surface-900/25"
        role="status"
        aria-live="polite"
        [attr.aria-label]="i18n.t('common.loading')"
      >
        <div
          class="flex flex-col items-center gap-3 rounded-2xl border border-surface-200 bg-white px-8 py-6 shadow-lg"
        >
          <app-spinner size="md" />
          <span class="text-sm font-medium text-surface-600">{{ i18n.t('common.loading') }}</span>
        </div>
      </div>
    }
  `,
})
export class PageLoading {
  private readonly loading = inject(LoadingStore);
  protected readonly i18n = inject(I18nService);

  readonly active = input<boolean | null>(null);

  readonly visible = computed(() => this.active() ?? this.loading.pageBusy());
}
