import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { I18nService } from '../../../core/i18n/i18n.service';
import { FormErrorItem } from '../../validation/form-error.util';

@Component({
  selector: 'app-validation-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div
        role="alert"
        class="flex flex-col gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800"
      >
        <div class="flex items-center gap-2 font-semibold">
          <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
          {{ title() || i18n.t('form.validationSummaryTitle') }}
        </div>

        <ul class="ml-5 list-disc">
          @for (item of items(); track item.field) {
            <li>{{ labelOf(item) }}: {{ messageOf(item) }}</li>
          }
        </ul>
      </div>
    }
  `,
})
export class ValidationSummary {
  protected readonly i18n = inject(I18nService);

  readonly items = input.required<readonly FormErrorItem[]>();
  readonly title = input('');

  readonly visible = computed(() => this.items().length > 0);

  labelOf(item: FormErrorItem): string {
    return item.labelKey ? this.i18n.t(item.labelKey) : item.field;
  }

  messageOf(item: FormErrorItem): string {
    return item.message.text ?? this.i18n.t(item.message.key, item.message.params);
  }
}
