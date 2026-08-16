import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input } from '@angular/core';

import { LoadingStore } from '../../../core/http/loading.store';
import { I18nService } from '../../../core/i18n/i18n.service';
import { AppSpinner } from './app-spinner';

@Component({
  selector: 'app-modal-loading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppSpinner],
  host: {
    class: 'app-modal-loading',
  },
  template: `
    @if (visible()) {
      <div
        class="flex h-full w-full items-center justify-center gap-3 rounded-[inherit] bg-white/70 backdrop-blur-[1px]"
        role="status"
        aria-live="polite"
        [attr.aria-label]="i18n.t('common.loading')"
      >
        <div class="flex flex-col items-center gap-2">
          <app-spinner size="sm" />
          <span class="text-xs font-medium text-surface-600">{{ i18n.t('common.loading') }}</span>
        </div>
      </div>
    }
  `,
})
export class ModalLoading {
  private readonly loading = inject(LoadingStore);
  protected readonly i18n = inject(I18nService);

  readonly active = input<boolean | null>(null);

  readonly visible = computed(() => this.active() ?? this.loading.modalBusy());

  constructor() {
    this.loading.registerModal();

    inject(DestroyRef).onDestroy(() => this.loading.releaseModal());
  }
}
