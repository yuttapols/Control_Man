import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

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
          {{ title() }}
        </div>

        <ul class="ml-5 list-disc">
          @for (item of items(); track item.field) {
            <li>{{ item.label }}: {{ item.message }}</li>
          }
        </ul>
      </div>
    }
  `,
})
export class ValidationSummary {
  readonly items = input.required<readonly FormErrorItem[]>();
  readonly title = input('กรุณาตรวจสอบข้อมูลต่อไปนี้');

  readonly visible = computed(() => this.items().length > 0);
}
