import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type ErrorTone = 'forbidden' | 'missing' | 'server';

const TONE_CLASS: Readonly<Record<ErrorTone, string>> = {
  forbidden: 'from-amber-50 to-orange-50 text-amber-600 ring-amber-100',
  missing: 'from-emerald-50 to-teal-50 text-emerald-600 ring-emerald-100',
  server: 'from-rose-50 to-red-50 text-rose-600 ring-rose-100',
};

@Component({
  selector: 'app-error-page-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-[calc(100vh-12rem)] items-center justify-center py-4' },
  template: `
    <section class="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-[1.05fr_0.95fr]">
      <div class="relative flex min-h-72 items-center justify-center overflow-hidden bg-gradient-to-br p-8 ring-1 ring-inset {{ toneClass() }} sm:min-h-96">
        <span class="absolute -top-16 -left-12 h-52 w-52 rounded-full bg-current opacity-[0.06]"></span>
        <span class="absolute -right-16 -bottom-20 h-64 w-64 rounded-full bg-current opacity-[0.08]"></span>

        <div class="relative flex flex-col items-center">
          <div class="relative flex h-52 w-52 items-center justify-center rounded-[2.5rem] border-8 border-white bg-white/80 shadow-2xl shadow-current/10 backdrop-blur sm:h-60 sm:w-60">
            <div class="absolute inset-x-5 top-5 flex justify-between" aria-hidden="true">
              <span class="h-7 w-3 rounded-full bg-current opacity-50"></span>
              <span class="h-7 w-3 rounded-full bg-current opacity-50"></span>
            </div>
            <div class="absolute inset-x-6 top-14 h-px bg-current opacity-15"></div>
            <i class="pi {{ icon() }} mt-8 text-7xl" aria-hidden="true"></i>
          </div>
          <span class="absolute -right-6 -bottom-3 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-slate-900 text-white shadow-lg">
            <i class="pi pi-calendar-clock text-2xl" aria-hidden="true"></i>
          </span>
        </div>
      </div>

      <div class="flex flex-col justify-center px-7 py-10 sm:px-12 lg:px-14">
        <p class="text-xs font-bold tracking-[0.3em] text-primary-600 uppercase">Control Man</p>
        <p class="mt-3 text-7xl font-black tracking-tighter text-surface-900 sm:text-8xl">{{ code() }}</p>
        <h1 class="mt-3 text-xl font-bold text-surface-900 sm:text-2xl">{{ title() }}</h1>
        <p class="mt-3 max-w-md text-sm leading-7 text-surface-500">{{ description() }}</p>

        @if (requestId()) {
          <p class="mt-4 w-fit rounded-lg bg-surface-100 px-3 py-2 font-mono text-xs text-surface-500">
            Request ID: {{ requestId() }}
          </p>
        }

        <div class="mt-7 flex flex-wrap gap-3">
          <ng-content />
        </div>
      </div>
    </section>
  `,
})
export class ErrorPageView {
  readonly code = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly icon = input.required<string>();
  readonly tone = input.required<ErrorTone>();
  readonly requestId = input('');

  readonly toneClass = computed(() => TONE_CLASS[this.tone()]);
}
