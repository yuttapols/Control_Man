import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AuthStore } from '../../core/auth/auth.store';
import { I18nService } from '../../core/i18n/i18n.service';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { PageState } from '../../shared/components/page-state/page-state';

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, PageState],
  template: `
    <app-page-header [title]="i18n.t('nav.dashboard')" [description]="greeting()" />

    <section
      class="app-brand-gradient flex flex-col gap-2 rounded-2xl px-5 py-6 text-white sm:px-7 sm:py-8"
    >
      <p class="text-sm text-white/80">{{ i18n.t('layout.brandSubtitle') }}</p>
      <h2 class="text-xl font-bold sm:text-2xl">{{ greeting() }}</h2>
      <p class="max-w-2xl text-sm text-white/85">
        {{ i18n.t('dashboard.heroHint') }}
      </p>
    </section>

    <app-page-state
      status="empty"
      [title]="i18n.t('dashboard.emptyTitle')"
      [description]="i18n.t('dashboard.emptyDescription')"
    />
  `,
})
export class DashboardPage {
  private readonly store = inject(AuthStore);
  protected readonly i18n = inject(I18nService);

  readonly greeting = computed(() =>
    this.i18n.t('dashboard.greeting', { name: this.store.displayName() }),
  );
}
