import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslationKey } from '../../../core/i18n/locales/th';

export type PageStatus = 'ready' | 'loading' | 'empty' | 'no-result' | 'error' | 'forbidden';

interface StateCopy {
  icon: string;
  iconClass: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
}

const STATE_COPY: Readonly<Record<Exclude<PageStatus, 'ready' | 'loading'>, StateCopy>> = {
  empty: {
    icon: 'pi pi-inbox',
    iconClass: 'text-surface-400',
    titleKey: 'pageState.emptyTitle',
    descriptionKey: 'pageState.emptyDescription',
  },
  'no-result': {
    icon: 'pi pi-search',
    iconClass: 'text-surface-400',
    titleKey: 'pageState.noResultTitle',
    descriptionKey: 'pageState.noResultDescription',
  },
  error: {
    icon: 'pi pi-exclamation-triangle',
    iconClass: 'text-red-500',
    titleKey: 'pageState.errorTitle',
    descriptionKey: 'pageState.errorDescription',
  },
  forbidden: {
    icon: 'pi pi-lock',
    iconClass: 'text-amber-500',
    titleKey: 'pageState.forbiddenTitle',
    descriptionKey: 'pageState.forbiddenDescription',
  },
};

@Component({
  selector: 'app-page-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Skeleton],
  template: `
    @switch (status()) {
      @case ('ready') {
        <ng-content />
      }

      @case ('loading') {
        <div class="flex flex-col gap-3" role="status" aria-live="polite">
          <span class="sr-only">{{ i18n.t('pageState.loading') }}</span>
          @for (row of skeletonRows(); track row) {
            <p-skeleton height="2.5rem" styleClass="w-full" />
          }
        </div>
      }

      @default {
        <div
          class="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-surface-300 px-6 py-12 text-center"
          role="status"
          aria-live="polite"
        >
          <i class="pi text-4xl {{ copy().icon }} {{ copy().iconClass }}" aria-hidden="true"></i>
          <h2 class="text-base font-semibold text-surface-800">
            {{ title() || i18n.t(copy().titleKey) }}
          </h2>
          <p class="max-w-md text-sm text-surface-500">
            {{ description() || i18n.t(copy().descriptionKey) }}
          </p>

          @if (requestId()) {
            <p class="font-mono text-xs text-surface-400">
              {{ i18n.t('pageState.requestId', { id: requestId() }) }}
            </p>
          }

          <div class="flex flex-wrap items-center justify-center gap-2">
            @if (showRetry()) {
              <p-button
                [label]="i18n.t('pageState.retry')"
                icon="pi pi-refresh"
                severity="secondary"
                (onClick)="retry.emit()"
              />
            }
            @if (showClearFilters()) {
              <p-button
                [label]="i18n.t('pageState.clearFilters')"
                icon="pi pi-filter-slash"
                severity="secondary"
                [outlined]="true"
                (onClick)="clearFilters.emit()"
              />
            }
          </div>
        </div>
      }
    }
  `,
})
export class PageState {
  protected readonly i18n = inject(I18nService);

  readonly status = input.required<PageStatus>();
  readonly title = input('');
  readonly description = input('');
  readonly requestId = input('');
  readonly skeletonCount = input(4);
  readonly showRetry = input(false);
  readonly showClearFilters = input(false);

  readonly retry = output<void>();
  readonly clearFilters = output<void>();

  readonly skeletonRows = computed(() =>
    Array.from({ length: this.skeletonCount() }, (_, index) => index),
  );

  readonly copy = computed<StateCopy>(() => {
    const status = this.status();

    return status === 'ready' || status === 'loading' ? STATE_COPY.error : STATE_COPY[status];
  });
}
