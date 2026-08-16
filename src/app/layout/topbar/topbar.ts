import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { AppConfigService } from '../../core/config/app-config.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { LayoutStore } from '../layout.store';
import { UserMenu } from '../user-menu/user-menu';

@Component({
  selector: 'app-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Tooltip, LanguageSwitcher, UserMenu],
  template: `
    <header
      class="sticky top-0 z-30 flex h-18 items-center justify-between gap-2 border-b border-surface-200 bg-white/95 px-3 shadow-sm backdrop-blur sm:px-5"
    >
      <div class="flex min-w-0 items-center gap-2">
        <p-button
          [icon]="toggleIcon()"
          severity="secondary"
          [text]="true"
          [rounded]="true"
          [ariaLabel]="toggleLabel()"
          [attr.aria-expanded]="sidebarExpanded()"
          [pTooltip]="toggleLabel()"
          tooltipPosition="bottom"
          (onClick)="toggleSidebar()"
        />

        <span class="truncate text-base font-bold text-surface-900 lg:hidden">
          {{ appName() }}
        </span>
      </div>

      <div class="flex shrink-0 items-center gap-1 sm:gap-2">
        <app-language-switcher />
        <app-user-menu />
      </div>
    </header>
  `,
})
export class Topbar {
  private readonly config = inject(AppConfigService);
  private readonly layout = inject(LayoutStore);
  protected readonly i18n = inject(I18nService);

  readonly appName = computed(() => this.config.appName());
  readonly sidebarExpanded = computed(() => this.layout.sidebarExpanded());

  readonly toggleIcon = computed(() => {
    if (this.layout.usesDrawer()) {
      return this.layout.drawerOpen() ? 'pi pi-times' : 'pi pi-bars';
    }

    return this.sidebarExpanded() ? 'pi pi-chevron-left' : 'pi pi-bars';
  });

  readonly toggleLabel = computed(() => {
    if (this.layout.usesDrawer()) {
      return this.i18n.t(this.layout.drawerOpen() ? 'layout.sidebarClose' : 'layout.sidebarOpen');
    }

    return this.i18n.t(this.sidebarExpanded() ? 'layout.sidebarCollapse' : 'layout.sidebarExpand');
  });

  toggleSidebar(): void {
    this.layout.toggleSidebar();
  }
}
