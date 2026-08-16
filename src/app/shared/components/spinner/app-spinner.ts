import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';

import { I18nService } from '../../../core/i18n/i18n.service';

export type SpinnerSize = 'sm' | 'md' | 'lg';

const SPINNER_PIXELS: Readonly<Record<SpinnerSize, string>> = {
  sm: '2rem',
  md: '3rem',
  lg: '4rem',
};

@Component({
  selector: 'app-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressSpinner],
  template: `
    <p-progress-spinner
      [style]="dimensions()"
      [strokeWidth]="strokeWidth()"
      [ariaLabel]="i18n.t('common.loading')"
      fill="transparent"
      animationDuration="0.9s"
    />
  `,
})
export class AppSpinner {
  protected readonly i18n = inject(I18nService);

  readonly size = input<SpinnerSize>('md');
  readonly strokeWidth = input('4');

  readonly dimensions = computed(() => {
    const pixels = SPINNER_PIXELS[this.size()];

    return { width: pixels, height: pixels };
  });
}
