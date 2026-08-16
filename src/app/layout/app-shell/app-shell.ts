import { A11yModule } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppBreadcrumb } from '../breadcrumb/app-breadcrumb';
import { I18nService } from '../../core/i18n/i18n.service';
import { LayoutStore } from '../layout.store';
import { AppBrand } from '../brand/app-brand';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, A11yModule, AppBreadcrumb, AppBrand, Sidebar, Topbar],
  host: {
    '(document:keydown.escape)': 'closeDrawer()',
  },
  template: `
    <div class="flex min-h-screen bg-slate-100">
      <aside
        class="app-sidebar-transition hidden shrink-0 flex-col bg-slate-950 text-slate-200 shadow-xl lg:flex"
        [class.w-64]="expanded()"
        [class.w-18]="!expanded()"
      >
        <app-brand [compact]="!expanded()" />
        <app-sidebar />
      </aside>

      @if (drawerOpen()) {
        <div class="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            class="absolute inset-0 h-full w-full bg-surface-900/50"
            [attr.aria-label]="i18n.t('layout.sidebarClose')"
            (click)="closeDrawer()"
          ></button>
          <aside
            class="app-drawer-enter absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-slate-950 text-slate-200 shadow-xl"
            cdkTrapFocus
            [cdkTrapFocusAutoCapture]="true"
          >
            <app-brand [compact]="false" [showClose]="true" (closeDrawer)="closeDrawer()" />
            <app-sidebar (navigate)="closeDrawer()" />
          </aside>
        </div>
      }

      <div class="flex min-w-0 flex-1 flex-col">
        <app-topbar />

        <main class="flex-1 px-4 py-4 sm:px-6 lg:px-7 lg:py-6">
          <div class="mx-auto flex w-full max-w-[100rem] flex-col gap-3">
            <app-breadcrumb />
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
  `,
})
export class AppShell {
  private readonly layout = inject(LayoutStore);
  protected readonly i18n = inject(I18nService);

  readonly expanded = computed(() => this.layout.sidebarExpanded());
  readonly drawerOpen = computed(() => this.layout.drawerOpen());

  closeDrawer(): void {
    this.layout.closeDrawer();
  }
}
