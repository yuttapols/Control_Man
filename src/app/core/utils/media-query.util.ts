import { DestroyRef, Signal, inject, signal } from '@angular/core';

export const BREAKPOINT_TABLET = '(min-width: 1024px)';
export const BREAKPOINT_DESKTOP = '(min-width: 1280px)';

export function mediaQuerySignal(query: string): Signal<boolean> {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return signal(false).asReadonly();
  }

  const mediaQuery = window.matchMedia(query);
  const matches = signal(mediaQuery.matches);
  const onChange = (event: MediaQueryListEvent) => matches.set(event.matches);

  mediaQuery.addEventListener('change', onChange);
  inject(DestroyRef).onDestroy(() => mediaQuery.removeEventListener('change', onChange));

  return matches.asReadonly();
}
