import { HttpContext, HttpContextToken } from '@angular/common/http';

export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);
export const REQUEST_TIMEOUT_MS = new HttpContextToken<number>(() => 0);

export interface HttpBehaviourOptions {
  skipLoading?: boolean;
  timeoutMs?: number;
}

export function httpContextFor(options: HttpBehaviourOptions = {}): HttpContext {
  const context = new HttpContext();

  if (options.skipLoading) {
    context.set(SKIP_LOADING, true);
  }

  if (options.timeoutMs !== undefined) {
    context.set(REQUEST_TIMEOUT_MS, options.timeoutMs);
  }

  return context;
}
