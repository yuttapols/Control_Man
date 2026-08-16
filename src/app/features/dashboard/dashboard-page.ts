import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AuthStore } from '../../core/auth/auth.store';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslationKey } from '../../core/i18n/locales/th';

interface DashboardItem {
  icon: string;
  labelKey: TranslationKey;
}

const WORKFLOW: readonly DashboardItem[] = [
  { icon: 'pi pi-calendar', labelKey: 'nav.calendar' },
  { icon: 'pi pi-file-edit', labelKey: 'nav.holidays' },
  { icon: 'pi pi-check-square', labelKey: 'nav.approvals' },
  { icon: 'pi pi-cloud-upload', labelKey: 'nav.apiConsumers' },
];

const CAPABILITIES: readonly DashboardItem[] = [
  { icon: 'pi pi-calendar-plus', labelKey: 'login.heroHighlight1' },
  { icon: 'pi pi-sitemap', labelKey: 'login.heroHighlight2' },
  { icon: 'pi pi-history', labelKey: 'login.heroHighlight3' },
];

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-5 lg:gap-6',
  },
  template: `
    <section class="app-brand-gradient relative overflow-hidden rounded-3xl px-6 py-7 text-white shadow-lg shadow-primary-900/15 sm:px-8 sm:py-9">
      <div class="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"></div>
      <div class="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-primary-300/20 blur-3xl"></div>
      <div class="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="flex max-w-2xl flex-col gap-2">
          <span class="w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">PHASE 1</span>
          <p class="text-sm font-medium text-white/75">{{ i18n.t('layout.brandSubtitle') }}</p>
          <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">{{ greeting() }}</h2>
          <p class="text-sm leading-6 text-white/80">{{ i18n.t('dashboard.heroHint') }}</p>
        </div>
        <div class="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-inner backdrop-blur" aria-hidden="true">
          <i class="pi pi-calendar-clock text-3xl"></i>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-surface-200 bg-white p-5 shadow-sm sm:p-7">
      <div class="mb-6 flex items-center gap-3">
        <span class="h-8 w-1 rounded-full bg-primary-500"></span>
        <div>
          <p class="text-xs font-semibold tracking-widest text-primary-600 uppercase">Workflow</p>
          <h2 class="text-lg font-bold text-surface-900">{{ i18n.t('login.heroTitle') }}</h2>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        @for (step of workflow; track step.labelKey; let index = $index; let last = $last) {
          <div class="group relative flex min-h-36 flex-col justify-between overflow-hidden rounded-2xl border border-surface-200 bg-gradient-to-br from-white to-surface-50 p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-900/10">
            <span class="absolute top-3 right-4 text-4xl font-black text-surface-100">0{{ index + 1 }}</span>
            <span class="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-primary-100 transition-colors group-hover:bg-primary-600 group-hover:text-white">
              <i class="{{ step.icon }} text-lg" aria-hidden="true"></i>
            </span>
            <div class="relative mt-5 flex items-end justify-between gap-2">
              <p class="text-sm font-semibold text-surface-800">{{ i18n.t(step.labelKey) }}</p>
              @if (!last) { <i class="pi pi-arrow-right text-xs text-surface-300" aria-hidden="true"></i> }
            </div>
          </div>
        }
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      @for (capability of capabilities; track capability.labelKey) {
        <article class="relative overflow-hidden rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
          <div class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary-400 to-primary-700"></div>
          <div class="flex items-start gap-4">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
              <i class="{{ capability.icon }} text-xl" aria-hidden="true"></i>
            </span>
            <div class="flex flex-col gap-1.5">
              <span class="text-[0.6875rem] font-bold tracking-widest text-surface-400 uppercase">Control Man</span>
              <h3 class="text-sm font-semibold leading-6 text-surface-800">{{ i18n.t(capability.labelKey) }}</h3>
            </div>
          </div>
        </article>
      }
    </section>
  `,
})
export class DashboardPage {
  private readonly store = inject(AuthStore);
  protected readonly i18n = inject(I18nService);

  readonly greeting = computed(() =>
    this.i18n.t('dashboard.greeting', { name: this.store.displayName() }),
  );
  readonly workflow = WORKFLOW;
  readonly capabilities = CAPABILITIES;
}
