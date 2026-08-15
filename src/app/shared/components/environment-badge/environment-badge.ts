import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AppConfigService } from '../../../core/config/app-config.service';
import { AppEnvironment } from '../../models/enums';

const ENVIRONMENT_CLASS: Readonly<Record<AppEnvironment, string>> = {
  DEV: 'bg-sky-100 text-sky-800 border-sky-300',
  UAT: 'bg-amber-100 text-amber-900 border-amber-400',
  PROD: 'bg-red-700 text-white border-red-800',
};

const ENVIRONMENT_LABEL: Readonly<Record<AppEnvironment, string>> = {
  DEV: 'DEV · ระบบพัฒนา',
  UAT: 'UAT · ทดสอบผู้ใช้',
  PROD: 'PROD · ใช้งานจริง',
};

@Component({
  selector: 'app-environment-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide {{
        badgeClass()
      }}"
    >
      <i class="pi pi-server text-xs" aria-hidden="true"></i>
      <span class="sr-only">สภาพแวดล้อมปัจจุบัน</span>
      {{ label() }}
    </span>
  `,
})
export class EnvironmentBadge {
  private readonly config = inject(AppConfigService);

  readonly environment = computed(() => this.config.environment());
  readonly badgeClass = computed(() => ENVIRONMENT_CLASS[this.environment()]);
  readonly label = computed(() => ENVIRONMENT_LABEL[this.environment()]);
}
