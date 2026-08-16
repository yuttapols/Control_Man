import { TestBed } from '@angular/core/testing';

import { BREAKPOINT_DESKTOP, BREAKPOINT_TABLET } from '../core/utils/media-query.util';
import { LayoutStore } from './layout.store';

type QueryListeners = Record<string, (event: MediaQueryListEvent) => void>;

function mockViewport(matches: Readonly<Record<string, boolean>>): QueryListeners {
  const listeners: QueryListeners = {};

  window.matchMedia = ((query: string) =>
    ({
      matches: matches[query] ?? false,
      media: query,
      addEventListener: (_: string, handler: (event: MediaQueryListEvent) => void) => {
        listeners[query] = handler;
      },
      removeEventListener: () => undefined,
    }) as unknown as MediaQueryList) as typeof window.matchMedia;

  return listeners;
}

function storeFor(matches: Readonly<Record<string, boolean>>): LayoutStore {
  mockViewport(matches);

  return TestBed.inject(LayoutStore);
}

const MOBILE = { [BREAKPOINT_TABLET]: false, [BREAKPOINT_DESKTOP]: false };
const TABLET = { [BREAKPOINT_TABLET]: true, [BREAKPOINT_DESKTOP]: false };
const DESKTOP = { [BREAKPOINT_TABLET]: true, [BREAKPOINT_DESKTOP]: true };

describe('LayoutStore', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    Reflect.deleteProperty(window, 'matchMedia');
  });

  it('uses the drawer below the tablet breakpoint and keeps it closed by default', () => {
    const store = storeFor(MOBILE);

    expect(store.mode()).toBe('drawer');
    expect(store.drawerOpen()).toBe(false);
  });

  it('toggles the drawer instead of collapsing when below the tablet breakpoint', () => {
    const store = storeFor(MOBILE);

    store.toggleSidebar();

    expect(store.drawerOpen()).toBe(true);
    expect(localStorage.getItem('thc.sidebar-collapsed')).toBeNull();

    store.closeDrawer();

    expect(store.drawerOpen()).toBe(false);
  });

  it('defaults to the icon rail on tablet and the expanded sidebar on desktop', () => {
    expect(storeFor(TABLET).mode()).toBe('rail');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    expect(storeFor(DESKTOP).mode()).toBe('expanded');
  });

  it('persists the collapse preference so it wins over the breakpoint default', () => {
    const store = storeFor(DESKTOP);

    store.toggleSidebar();

    expect(store.mode()).toBe('rail');
    expect(localStorage.getItem('thc.sidebar-collapsed')).toBe('true');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    expect(storeFor(DESKTOP).mode()).toBe('rail');
  });

  it('reacts to a viewport change without losing the drawer state', () => {
    const listeners = mockViewport(MOBILE);
    const store = TestBed.inject(LayoutStore);

    store.toggleSidebar();
    expect(store.drawerOpen()).toBe(true);

    listeners[BREAKPOINT_TABLET]({ matches: true } as MediaQueryListEvent);

    expect(store.usesDrawer()).toBe(false);
    expect(store.drawerOpen()).toBe(false);
    expect(store.mode()).toBe('rail');
  });
});
