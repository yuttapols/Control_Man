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
import { problemMessage } from '../../core/error/problem-detail';
import { DEFAULT_LANDING_URL, sanitizeReturnUrl } from '../../core/utils/url.util';
import { EnvironmentBadge } from '../../shared/components/environment-badge/environment-badge';
import { FormField, describedByIds } from '../../shared/components/form-field/form-field';
import { ValidationSummary } from '../../shared/components/validation-summary/validation-summary';
import { ProblemDetail } from '../../shared/models/api.model';
import { AppValidators } from '../../shared/validation/app-validators';
import {
  FormErrorItem,
  applyServerFieldErrors,
  clearServerFieldErrors,
  formErrorSummary,
  markAllControlsTouched,
} from '../../shared/validation/form-error.util';

const REMEMBERED_USERNAME_KEY = 'thc.remembered-username';

const FIELD_LABELS: Readonly<Record<string, string>> = {
  username: 'ชื่อผู้ใช้หรืออีเมล',
  password: 'รหัสผ่าน',
};

const GENERIC_AUTH_ERROR = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบแล้วลองใหม่';

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
    <div class="flex min-h-screen items-center justify-center bg-surface-100 p-4">
      <div class="w-full max-w-md rounded-xl border border-surface-200 bg-white p-8 shadow-sm">
        <div class="mb-6 flex flex-col items-center gap-2 text-center">
          <h1 class="text-xl font-semibold text-surface-900">{{ appName() }}</h1>
          <p class="text-sm text-surface-500">เข้าสู่ระบบเพื่อใช้งานระบบควบคุมวันหยุด</p>
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
            label="ชื่อผู้ใช้หรืออีเมล"
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
            label="รหัสผ่าน"
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
            <label for="rememberUsername" class="text-sm text-surface-700">จดจำชื่อผู้ใช้</label>
          </div>

          <p-button
            type="submit"
            label="เข้าสู่ระบบ"
            icon="pi pi-sign-in"
            styleClass="w-full"
            [loading]="submitting()"
          />
        </form>

        <p class="mt-6 text-center text-xs text-surface-500">
          ลืมรหัสผ่านหรือบัญชีถูกล็อก กรุณาติดต่อผู้ดูแลระบบ
        </p>
      </div>
    </div>
  `,
})
export class LoginPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly config = inject(AppConfigService);

  readonly form = this.fb.group({
    username: ['', [Validators.required, AppValidators.notBlank(), AppValidators.username()]],
    password: ['', [Validators.required, AppValidators.password()]],
    rememberUsername: [false],
  });

  readonly submitting = signal(false);
  readonly authError = signal<string | null>(null);
  readonly errorSummary = signal<readonly FormErrorItem[]>([]);

  readonly appName = computed(() => this.config.appName());
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
      this.errorSummary.set(formErrorSummary(this.form, FIELD_LABELS));
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
      this.authError.set(GENERIC_AUTH_ERROR);
      this.form.controls.password.reset();
      return;
    }

    const unmapped = applyServerFieldErrors(this.form, problem);

    if (unmapped.length > 0 || (problem.errors ?? []).length === 0) {
      this.authError.set(problemMessage(problem));
    }

    this.errorSummary.set(formErrorSummary(this.form, FIELD_LABELS));
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
