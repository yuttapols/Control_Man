import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Tooltip } from 'primeng/tooltip';

import { AuthService } from '../../core/auth/auth.service';
import { AuthStore } from '../../core/auth/auth.store';
import { I18nService } from '../../core/i18n/i18n.service';
import { LayoutStore } from '../layout.store';

@Component({
  selector: 'app-user-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Menu, Tooltip],
  template: `
    <button
      type="button"
      class="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm text-surface-700 transition-colors hover:bg-surface-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      [class.justify-center]="!expanded()"
      aria-haspopup="true"
      aria-controls="user-menu"
      [attr.aria-label]="expanded() ? null : displayName()"
      [pTooltip]="expanded() ? '' : displayName()"
      tooltipPosition="right"
      (click)="userMenu.toggle($event)"
    >
      <span
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-800"
        aria-hidden="true"
        >{{ initials() }}</span
      >

      @if (expanded()) {
        <span class="flex min-w-0 flex-1 flex-col leading-tight">
          <span class="truncate font-semibold text-surface-900">{{ displayName() }}</span>
          <span class="truncate text-xs text-surface-500">{{ roleLabel() }}</span>
        </span>
        <i class="pi pi-ellipsis-v text-xs text-surface-400" aria-hidden="true"></i>
      }
    </button>

    <p-menu #userMenu id="user-menu" [model]="menuItems()" [popup]="true" styleClass="w-56" />
  `,
})
export class UserMenu {
  private readonly store = inject(AuthStore);
  private readonly auth = inject(AuthService);
  private readonly layout = inject(LayoutStore);
  protected readonly i18n = inject(I18nService);

  readonly expanded = computed(() => this.layout.sidebarExpanded());
  readonly displayName = computed(() => this.store.displayName());
  readonly initials = computed(() => this.store.initials());
  readonly roleLabel = computed(() => this.store.roles().join(', ') || this.i18n.t('user.noRole'));

  readonly menuItems = computed<MenuItem[]>(() => [
    {
      label: this.displayName(),
      items: [
        {
          label: `${this.i18n.t('user.role')}: ${this.roleLabel()}`,
          disabled: true,
        },
        {
          label: this.i18n.t('user.logout'),
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
