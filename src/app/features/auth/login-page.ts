import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';

import { AuthService } from '../../core/auth/auth.service';
import { AppConfigService } from '../../core/config/app-config.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslationKey } from '../../core/i18n/locales/th';
import { DEFAULT_LANDING_URL, sanitizeReturnUrl } from '../../core/utils/url.util';
import { EnvironmentBadge } from '../../shared/components/environment-badge/environment-badge';
import { FormField, describedByIds } from '../../shared/components/form-field/form-field';
import { ValidationSummary } from '../../shared/components/validation-summary/validation-summary';
import { ProblemDetail } from '../../shared/models/api.model';
import { APP_VERSION } from '../../shared/constants/app-version.constant';
import { AppValidators } from '../../shared/validation/app-validators';
import {
  FormErrorItem,
  applyServerFieldErrors,
  clearServerFieldErrors,
  formErrorSummary,
  markAllControlsTouched,
} from '../../shared/validation/form-error.util';

const REMEMBERED_USERNAME_KEY = 'thc.remembered-username';

const FIELD_LABEL_KEYS: Readonly<Record<string, TranslationKey>> = {
  username: 'login.username',
  password: 'login.password',
};


const BRAND_HIGHLIGHT_KEYS: readonly TranslationKey[] = [
  'login.heroHighlight1',
  'login.heroHighlight2',
  'login.heroHighlight3',
];

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Button,
    Checkbox,
    InputText,
    Message,
    Password,
    EnvironmentBadge,
    FormField,
    ValidationSummary,
  ],
  template: `
    <div class="grid min-h-screen bg-white lg:grid-cols-2">
      <section
        class="app-brand-gradient hidden flex-col justify-between p-10 text-white lg:flex xl:p-14"
      >
        <div class="flex items-center gap-3">
          <span
            class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur"
            aria-hidden="true"
          >
            <i class="pi pi-calendar-clock text-xl"></i>
          </span>
          <span class="text-lg font-bold">{{ appName() }}</span>
        </div>

        <div class="flex flex-col gap-4">
          <h2 class="text-3xl font-bold xl:text-4xl">{{ i18n.t('login.heroTitle') }}</h2>
          <p class="max-w-md text-sm text-white/85">
            {{ i18n.t('login.heroDescription') }}
          </p>

          <ul class="flex flex-col gap-2.5 text-sm text-white/85">
            @for (highlightKey of highlightKeys; track highlightKey) {
              <li class="flex items-center gap-2.5">
                <i class="pi pi-check-circle" aria-hidden="true"></i>
                <span>{{ i18n.t(highlightKey) }}</span>
              </li>
            }
          </ul>
        </div>

        <p class="text-xs text-white/70">{{ i18n.t('login.heroFooter') }}</p>
      </section>

      <section class="flex items-center justify-center bg-surface-50 p-4 sm:p-8">
        <div
          class="w-full max-w-md rounded-2xl border border-surface-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div class="mb-6 flex flex-col items-center gap-2 text-center">
            <span
              class="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm lg:hidden"
              aria-hidden="true"
            >
              <i class="pi pi-calendar-clock text-xl"></i>
            </span>
            <h1 class="text-xl font-bold text-surface-900">{{ appName() }}</h1>
            <p class="text-sm text-surface-500">{{ i18n.t('login.subtitle') }}</p>
            <app-environment-badge />
          </div>

          <form class="flex flex-col gap-4" [formGroup]="form" (ngSubmit)="submit()" novalidate>
          @if (errorSummary().length > 1) {
            <app-validation-summary [items]="errorSummary()" />
          }

          @if (authError()) {
            <p-message severity="error" class="w-full">{{ authError() }}</p-message>
          }

          <app-form-field
            [label]="i18n.t('login.username')"
            controlId="username"
            [control]="form.controls.username"
            [required]="true"
          >
            <input
              pInputText
              id="username"
              type="text"
              formControlName="username"
              autocomplete="username"
              class="w-full"
              [attr.aria-describedby]="usernameDescribedBy"
              [attr.aria-invalid]="form.controls.username.invalid && form.controls.username.touched"
            />
          </app-form-field>

          <app-form-field
            [label]="i18n.t('login.password')"
            controlId="password"
            [control]="form.controls.password"
            [required]="true"
          >
            <p-password
              inputId="password"
              formControlName="password"
              [toggleMask]="true"
              [feedback]="false"
              styleClass="w-full"
              inputStyleClass="w-full"
              autocomplete="current-password"
              [pt]="passwordPassThrough"
            />
          </app-form-field>

          <div class="flex items-center gap-2">
            <p-checkbox
              inputId="rememberUsername"
              formControlName="rememberUsername"
              [binary]="true"
            />
            <label for="rememberUsername" class="text-sm text-surface-700">{{ i18n.t('login.rememberUsername') }}</label>
          </div>

          <p-button
            type="submit"
            [label]="i18n.t('login.submit')"
            icon="pi pi-sign-in"
            styleClass="w-full"
            [loading]="submitting()"
          />
          <p class="text-center text-xs text-surface-400">Version {{ appVersion }}</p>
          </form>

          <p class="mt-6 text-center text-xs text-surface-500">
            {{ i18n.t('login.contactAdmin') }}
          </p>
        </div>
      </section>
    </div>
  `,
})
export class LoginPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly config = inject(AppConfigService);
  protected readonly i18n = inject(I18nService);

  readonly form = this.fb.group({
    username: ['', [Validators.required, AppValidators.notBlank(), AppValidators.username()]],
    password: ['', [Validators.required, AppValidators.password()]],
    rememberUsername: [false],
  });

  readonly submitting = signal(false);
  readonly authError = signal<string | null>(null);
  readonly errorSummary = signal<readonly FormErrorItem[]>([]);

  readonly appName = computed(() => this.config.appName());
  readonly appVersion = APP_VERSION;
  readonly highlightKeys = BRAND_HIGHLIGHT_KEYS;
  readonly usernameDescribedBy = describedByIds('username');
  readonly passwordPassThrough = {
    pcInputText: { root: { 'aria-describedby': describedByIds('password') } },
  };

  constructor() {
    const remembered = localStorage.getItem(REMEMBERED_USERNAME_KEY);

    if (remembered) {
      this.form.patchValue({ username: remembered, rememberUsername: true });
    }
  }

  submit(): void {
    this.authError.set(null);
    clearServerFieldErrors(this.form);

    if (this.form.invalid) {
      markAllControlsTouched(this.form);
      this.errorSummary.set(formErrorSummary(this.form, FIELD_LABEL_KEYS));
      return;
    }

    this.errorSummary.set([]);
    this.submitting.set(true);

    const { username, password, rememberUsername } = this.form.getRawValue();

    this.auth.login({ username: username.trim(), password }).subscribe({
      next: () => {
        this.persistUsername(username.trim(), rememberUsername);
        void this.router.navigateByUrl(this.resolveReturnUrl());
      },
      error: (problem: ProblemDetail) => {
        this.submitting.set(false);
        this.handleLoginError(problem);
      },
    });
  }

  private handleLoginError(problem: ProblemDetail): void {
    if (problem.status === 401) {
      this.authError.set(this.i18n.t('login.invalidCredentials'));
      this.form.controls.password.reset();
      return;
    }

    const unmapped = applyServerFieldErrors(this.form, problem);

    if (unmapped.length > 0 || (problem.errors ?? []).length === 0) {
      this.authError.set(this.i18n.problemMessage(problem));
    }

    this.errorSummary.set(formErrorSummary(this.form, FIELD_LABEL_KEYS));
  }

  private persistUsername(username: string, remember: boolean): void {
    if (remember) {
      localStorage.setItem(REMEMBERED_USERNAME_KEY, username);
      return;
    }

    localStorage.removeItem(REMEMBERED_USERNAME_KEY);
  }

  private resolveReturnUrl(): string {
    return sanitizeReturnUrl(
      this.route.snapshot.queryParamMap.get('returnUrl'),
      DEFAULT_LANDING_URL,
    );
  }
}
