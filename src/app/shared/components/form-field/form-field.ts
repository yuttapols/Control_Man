import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { EMPTY, switchMap } from 'rxjs';

import { I18nService } from '../../../core/i18n/i18n.service';
import { controlErrorMessage } from '../../validation/form-error.util';

export function helpId(controlId: string): string {
  return `${controlId}-help`;
}

export function errorId(controlId: string): string {
  return `${controlId}-error`;
}

export function describedByIds(controlId: string): string {
  return `${helpId(controlId)} ${errorId(controlId)}`;
}

@Component({
  selector: 'app-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-1.5">
      <label [for]="controlId()" class="text-sm font-medium text-surface-700">
        {{ label() }}
        @if (required()) {
          <span class="text-red-600" aria-hidden="true">*</span>
          <span class="sr-only">{{ i18n.t('form.requiredMarker') }}</span>
        }
      </label>

      <ng-content />

      @if (help() && !errorText()) {
        <small [id]="helpElementId()" class="text-xs text-surface-500">{{ help() }}</small>
      }

      @if (errorText()) {
        <small
          [id]="errorElementId()"
          role="alert"
          class="flex items-center gap-1 text-xs font-medium text-red-600"
        >
          <i class="pi pi-exclamation-circle" aria-hidden="true"></i>
          {{ errorText() }}
        </small>
      }
    </div>
  `,
})
export class FormField {
  protected readonly i18n = inject(I18nService);

  readonly label = input.required<string>();
  readonly controlId = input.required<string>();
  readonly control = input<AbstractControl | null>(null);
  readonly help = input('');
  readonly required = input(false);

  private readonly controlEvents = toSignal(
    toObservable(this.control).pipe(switchMap((control) => control?.events ?? EMPTY)),
  );

  readonly helpElementId = computed(() => helpId(this.controlId()));
  readonly errorElementId = computed(() => errorId(this.controlId()));
  readonly errorText = computed(() => {
    this.controlEvents();

    const message = controlErrorMessage(this.control());

    if (!message) {
      return null;
    }

    return message.text ?? this.i18n.t(message.key, message.params);
  });
}
