import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Tooltip } from 'primeng/tooltip';

import { AuthService } from '../../core/auth/auth.service';
import { AuthStore } from '../../core/auth/auth.store';
import { AppConfigService } from '../../core/config/app-config.service';
import { EnvironmentBadge } from '../../shared/components/environment-badge/environment-badge';

@Component({
  selector: 'app-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Menu, Tooltip, EnvironmentBadge],
  template: `
    <header
      class="flex h-16 items-center justify-between gap-3 border-b border-surface-200 bg-white px-4"
    >
      <div class="flex items-center gap-3">
        <p-button
          icon="pi pi-bars"
          severity="secondary"
          [text]="true"
          styleClass="lg:hidden"
          ariaLabel="เปิดหรือปิดเมนูหลัก"
          (onClick)="toggleSidebar.emit()"
        />
        <span class="text-base font-semibold text-surface-900">{{ appName() }}</span>
        <app-environment-badge />
      </div>

      <div class="flex items-center gap-2">
        <p-button
          icon="pi pi-bell"
          severity="secondary"
          [text]="true"
          [disabled]="true"
          ariaLabel="การแจ้งเตือน"
          pTooltip="การแจ้งเตือนจะเปิดใช้งานในเฟสถัดไป"
          tooltipPosition="bottom"
        />

        <button
          type="button"
          class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-surface-700 hover:bg-surface-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          aria-haspopup="true"
          aria-controls="user-menu"
          (click)="userMenu.toggle($event)"
        >
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700"
            aria-hidden="true"
            >{{ initials() }}</span
          >
          <span class="hidden sm:inline">{{ displayName() }}</span>
          <i class="pi pi-angle-down text-xs" aria-hidden="true"></i>
        </button>

        <p-menu #userMenu id="user-menu" [model]="menuItems()" [popup]="true" />
      </div>
    </header>
  `,
})
export class Topbar {
  private readonly config = inject(AppConfigService);
  private readonly store = inject(AuthStore);
  private readonly auth = inject(AuthService);

  readonly toggleSidebar = output<void>();

  readonly appName = computed(() => this.config.appName());
  readonly displayName = computed(() => this.store.displayName());
  readonly initials = computed(() => this.store.initials());

  readonly menuItems = computed<MenuItem[]>(() => [
    {
      label: this.store.displayName(),
      items: [
        {
          label: `บทบาท: ${this.store.roles().join(', ') || 'ไม่มีบทบาท'}`,
          disabled: true,
        },
        {
          label: 'ออกจากระบบ',
          icon: 'pi pi-sign-out',
          command: () => this.logout(),
        },
      ],
    },
  ]);

  private logout(): void {
    this.auth.logout().subscribe();
  }
}
