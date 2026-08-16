import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Menu } from 'primeng/menu';
import { Tooltip } from 'primeng/tooltip';

import { AuthService } from '../../core/auth/auth.service';
import { AuthStore } from '../../core/auth/auth.store';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-user-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ConfirmDialog, Menu, Tooltip],
  providers: [ConfirmationService],
  template: `
    <button
      type="button"
      class="flex cursor-pointer items-center rounded-xl p-1.5 text-sm text-surface-700 transition-colors hover:bg-surface-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      aria-haspopup="true"
      aria-controls="user-menu"
      [attr.aria-label]="displayName()"
      [pTooltip]="displayName()"
      tooltipPosition="bottom"
      (click)="userMenu.toggle($event)"
    >
      <span
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-800"
        aria-hidden="true"
        >{{ initials() }}</span
      >
    </button>

    <p-menu #userMenu id="user-menu" [model]="menuItems()" [popup]="true" styleClass="w-56" />
    <p-confirmdialog />
  `,
})
export class UserMenu {
  private readonly store = inject(AuthStore);
  private readonly auth = inject(AuthService);
  private readonly confirmation = inject(ConfirmationService);
  protected readonly i18n = inject(I18nService);

  readonly displayName = computed(() => this.store.displayName());
  readonly initials = computed(() => this.store.initials());

  readonly menuItems = computed<MenuItem[]>(() => [
    {
      label: this.displayName(),
      items: [
        {
          separator: true,
        },
        {
          label: this.i18n.t('user.logout'),
          icon: 'pi pi-sign-out',
          styleClass: 'app-user-menu-logout',
          command: () => this.confirmLogout(),
        },
      ],
    },
  ]);

  private confirmLogout(): void {
    this.confirmation.confirm({
      header: this.i18n.t('user.logoutConfirmTitle'),
      message: this.i18n.t('user.logoutConfirmMessage'),
      icon: 'pi pi-sign-out',
      acceptLabel: this.i18n.t('user.logout'),
      rejectLabel: this.i18n.t('user.logoutCancel'),
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => this.auth.logout().subscribe(),
    });
  }
}
