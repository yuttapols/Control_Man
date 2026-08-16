import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';

import { PermissionService } from '../../core/auth/permission.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslationKey } from '../../core/i18n/locales/th';
import { LayoutStore } from '../layout.store';
import { NAV_SECTIONS, NavSection } from '../nav.config';
import { APP_VERSION } from '../../shared/constants/app-version.constant';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Tooltip],
  host: {
    class: 'flex min-h-0 flex-1 flex-col',
  },
  template: `
    <nav class="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4" [attr.aria-label]="i18n.t('nav.ariaLabel')">
      @for (section of visibleSections(); track section.titleKey) {
        @if (section.titleKey) {
          @if (expanded()) {
            <button
              type="button"
              class="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              [attr.aria-expanded]="sectionOpen(section.titleKey)"
              (click)="toggleSection(section.titleKey)"
            >
              <i class="{{ section.icon }} text-base text-primary-400" aria-hidden="true"></i>
              <span class="min-w-0 flex-1 truncate">{{ i18n.t(section.titleKey) }}</span>
              <i
                class="pi text-xs text-slate-500 transition-transform"
                [class.pi-chevron-down]="sectionOpen(section.titleKey)"
                [class.pi-chevron-right]="!sectionOpen(section.titleKey)"
                aria-hidden="true"
              ></i>
            </button>
          } @else {
            <hr class="mx-2 my-2 border-white/10" [attr.aria-label]="i18n.t(section.titleKey)" />
          }
        }

        @if (!section.titleKey || !expanded() || sectionOpen(section.titleKey)) {
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
            class="group relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
            [class.px-3]="expanded()"
            [class.ml-3]="expanded() && section.titleKey"
            [class.w-[calc(100%-0.75rem)]]="expanded() && section.titleKey"
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
      }
    </nav>

    <div class="shrink-0 border-t border-white/10 p-2">
      <p
        class="text-center text-[0.6875rem] text-slate-500"
        [attr.aria-label]="'Version ' + appVersion"
      >
        {{ expanded() ? 'Version ' + appVersion : 'v' + appVersion }}
      </p>
    </div>
  `,
  styles: `
    .app-nav-active {
      background-color: color-mix(in srgb, var(--p-primary-500) 20%, transparent);
      color: white;
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
  readonly appVersion = APP_VERSION;
  private readonly openSections = signal(
    new Set<TranslationKey>([
      'nav.section.holidayData',
      'nav.section.approval',
      'nav.section.administration',
    ]),
  );

  readonly visibleSections = computed<NavSection[]>(() =>
    NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => this.permissions.canAny(item.permissions)),
    })).filter((section) => section.items.length > 0),
  );

  sectionOpen(titleKey: TranslationKey): boolean {
    return this.openSections().has(titleKey);
  }

  toggleSection(titleKey: TranslationKey): void {
    this.openSections.update((current) => {
      const next = new Set(current);

      if (next.has(titleKey)) {
        next.delete(titleKey);
      } else {
        next.add(titleKey);
      }

      return next;
    });
  }
}
