import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';

import { PermissionService } from '../../core/auth/permission.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { LayoutStore } from '../layout.store';
import { NAV_SECTIONS, NavSection } from '../nav.config';
import { UserMenu } from '../user-menu/user-menu';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Tooltip, UserMenu],
  host: {
    class: 'flex min-h-0 flex-1 flex-col',
  },
  template: `
    <nav class="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4" [attr.aria-label]="i18n.t('nav.ariaLabel')">
      @for (section of visibleSections(); track section.titleKey) {
        @if (section.titleKey) {
          @if (expanded()) {
            <p
              class="mt-4 mb-1 px-3 text-xs font-semibold tracking-wide text-surface-400 uppercase"
            >
              {{ i18n.t(section.titleKey) }}
            </p>
          } @else {
            <hr class="mx-2 my-2 border-surface-200" [attr.aria-label]="i18n.t(section.titleKey)" />
          }
        }

        @for (item of section.items; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="app-nav-active"
            #linkActive="routerLinkActive"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
            [attr.aria-current]="linkActive.isActive ? 'page' : null"
            [attr.aria-label]="expanded() ? null : i18n.t(item.labelKey)"
            [pTooltip]="expanded() ? '' : i18n.t(item.labelKey)"
            tooltipPosition="right"
            class="group relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium text-surface-600 transition-colors hover:bg-primary-50 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            [class.px-3]="expanded()"
            [class.justify-center]="!expanded()"
            [class.px-0]="!expanded()"
            (click)="navigate.emit()"
          >
            <i class="{{ item.icon }} text-base" aria-hidden="true"></i>
            @if (expanded()) {
              <span class="truncate">{{ i18n.t(item.labelKey) }}</span>
            }
          </a>
        }
      }
    </nav>

    <div class="shrink-0 border-t border-surface-200 p-2">
      <app-user-menu />
    </div>
  `,
  styles: `
    .app-nav-active {
      background-color: var(--p-primary-50);
      color: var(--p-primary-800);
      font-weight: 600;
    }

    .app-nav-active::before {
      content: '';
      position: absolute;
      inset-block: 0.375rem;
      inset-inline-start: 0;
      width: 3px;
      border-radius: 9999px;
      background-color: var(--p-primary-500);
    }
  `,
})
export class Sidebar {
  protected readonly i18n = inject(I18nService);
  private readonly permissions = inject(PermissionService);
  private readonly layout = inject(LayoutStore);

  readonly navigate = output<void>();

  readonly expanded = computed(() => this.layout.sidebarExpanded());

  readonly visibleSections = computed<NavSection[]>(() =>
    NAV_SECTIONS.map((section) => ({
      titleKey: section.titleKey,
      items: section.items.filter((item) => this.permissions.canAny(item.permissions)),
    })).filter((section) => section.items.length > 0),
  );
}
