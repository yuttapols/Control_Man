import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Button } from 'primeng/button';

import { AppConfigService } from '../../core/config/app-config.service';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-brand',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  template: `
    <div
      class="flex h-16 shrink-0 items-center gap-3 border-b border-surface-200 px-4"
      [class.justify-center]="compact()"
      [class.px-0]="compact()"
    >
      <span
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm"
        aria-hidden="true"
      >
        <i class="pi pi-calendar-clock text-lg"></i>
      </span>

      @if (!compact()) {
        <span class="flex min-w-0 flex-col leading-tight">
          <span class="truncate text-sm font-bold text-surface-900">{{ appName() }}</span>
          <span class="truncate text-xs text-surface-500">{{ i18n.t('layout.brandSubtitle') }}</span>
        </span>
      }

      @if (showClose()) {
        <p-button
          icon="pi pi-times"
          severity="secondary"
          [text]="true"
          [rounded]="true"
          styleClass="ml-auto"
          [ariaLabel]="i18n.t('layout.sidebarClose')"
          (onClick)="closeDrawer.emit()"
        />
      }
    </div>
  `,
})
export class AppBrand {
  private readonly config = inject(AppConfigService);
  protected readonly i18n = inject(I18nService);

  readonly compact = input(false);
  readonly showClose = input(false);

  readonly closeDrawer = output<void>();

  readonly appName = computed(() => this.config.appName());
}
