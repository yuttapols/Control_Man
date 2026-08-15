import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppBreadcrumb } from '../breadcrumb/app-breadcrumb';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, AppBreadcrumb, Sidebar, Topbar],
  template: `
    <div class="flex min-h-screen flex-col bg-surface-50">
      <app-topbar (toggleSidebar)="toggleSidebar()" />

      <div class="flex flex-1 overflow-hidden">
        <aside class="hidden w-64 shrink-0 border-r border-surface-200 bg-white lg:block">
          <app-sidebar />
        </aside>

        @if (sidebarOpen()) {
          <div class="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              class="absolute inset-0 h-full w-full bg-black/40"
              aria-label="ปิดเมนูหลัก"
              (click)="closeSidebar()"
            ></button>
            <aside class="absolute inset-y-0 left-0 w-64 border-r border-surface-200 bg-white">
              <app-sidebar (navigate)="closeSidebar()" />
            </aside>
          </div>
        }

        <main class="flex-1 overflow-y-auto p-4 lg:p-6">
          <div class="mx-auto flex max-w-7xl flex-col gap-4">
            <app-breadcrumb />
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
  `,
})
export class AppShell {
  readonly sidebarOpen = signal(false);

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
