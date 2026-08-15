import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { PermissionService } from '../../core/auth/permission.service';
import { NAV_ITEMS } from '../nav.config';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="flex h-full w-full flex-col gap-1 p-3" aria-label="เมนูหลัก">
      @for (item of visibleItems(); track item.route) {
        <a
          [routerLink]="item.route"
          routerLinkActive="bg-primary-50 text-primary-700 font-semibold"
          [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
          class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-surface-700 transition-colors hover:bg-surface-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          (click)="navigate.emit()"
        >
          <i class="{{ item.icon }} text-base" aria-hidden="true"></i>
          <span>{{ item.label }}</span>
        </a>
      }
    </nav>
  `,
})
export class Sidebar {
  private readonly permissions = inject(PermissionService);

  readonly navigate = output<void>();

  readonly visibleItems = computed(() =>
    NAV_ITEMS.filter((item) => this.permissions.canAny(item.permissions)),
  );
}
