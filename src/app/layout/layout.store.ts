import { Injectable, computed, signal } from '@angular/core';

import {
  BREAKPOINT_DESKTOP,
  BREAKPOINT_TABLET,
  mediaQuerySignal,
} from '../core/utils/media-query.util';

export type SidebarMode = 'drawer' | 'rail' | 'expanded';

const SIDEBAR_COLLAPSED_KEY = 'thc.sidebar-collapsed';

function readStoredPreference(): boolean | null {
  try {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);

    return stored === null ? null : stored === 'true';
  } catch {
    return null;
  }
}

function writeStoredPreference(collapsed: boolean): void {
  try {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  } catch {
    return;
  }
}

@Injectable({ providedIn: 'root' })
export class LayoutStore {
  private readonly tabletUp = mediaQuerySignal(BREAKPOINT_TABLET);
  private readonly desktopUp = mediaQuerySignal(BREAKPOINT_DESKTOP);
  private readonly collapsedPreference = signal<boolean | null>(readStoredPreference());
  private readonly drawerRequested = signal(false);

  readonly usesDrawer = computed(() => !this.tabletUp());

  readonly drawerOpen = computed(() => this.usesDrawer() && this.drawerRequested());

  readonly collapsed = computed(() => this.collapsedPreference() ?? !this.desktopUp());

  readonly mode = computed<SidebarMode>(() => {
    if (this.usesDrawer()) {
      return 'drawer';
    }

    return this.collapsed() ? 'rail' : 'expanded';
  });

  readonly sidebarExpanded = computed(() => this.mode() !== 'rail');

  toggleSidebar(): void {
    if (this.usesDrawer()) {
      this.drawerRequested.update((open) => !open);
      return;
    }

    const next = !this.collapsed();

    this.collapsedPreference.set(next);
    writeStoredPreference(next);
  }

  closeDrawer(): void {
    this.drawerRequested.set(false);
  }
}
