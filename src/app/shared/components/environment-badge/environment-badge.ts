import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { AppConfigService } from '../../../core/config/app-config.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslationKey } from '../../../core/i18n/locales/th';
import { AppEnvironment } from '../../models/enums';

const ENVIRONMENT_CLASS: Readonly<Record<AppEnvironment, string>> = {
  DEV: 'bg-sky-100 text-sky-800 border-sky-300',
  UAT: 'bg-amber-100 text-amber-900 border-amber-400',
  PROD: 'bg-red-700 text-white border-red-800',
};

const ENVIRONMENT_LABEL_KEY: Readonly<Record<AppEnvironment, TranslationKey>> = {
  DEV: 'env.dev',
  UAT: 'env.uat',
  PROD: 'env.prod',
};

@Component({
  selector: 'app-environment-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide {{
        badgeClass()
      }}"
    >
      <i class="pi pi-server text-xs" aria-hidden="true"></i>
      <span class="sr-only">{{ i18n.t('env.aria') }}</span>
      {{ label() }}
    </span>
  `,
})
export class EnvironmentBadge {
  private readonly config = inject(AppConfigService);
  protected readonly i18n = inject(I18nService);

  readonly compact = input(false);

  readonly environment = computed(() => this.config.environment());
  readonly badgeClass = computed(() => ENVIRONMENT_CLASS[this.environment()]);
  readonly label = computed(() =>
    this.compact() ? this.environment() : this.i18n.t(ENVIRONMENT_LABEL_KEY[this.environment()]),
  );
}
