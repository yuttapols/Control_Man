import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap items-start justify-between gap-3 border-b border-surface-200 pb-4">
      <div class="flex flex-col gap-1">
        <h1 class="text-xl font-semibold text-surface-900">{{ title() }}</h1>
        @if (description()) {
          <p class="text-sm text-surface-500">{{ description() }}</p>
        }
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <ng-content select="[appPageActions]" />
      </div>
    </div>
  `,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly description = input('');
}
