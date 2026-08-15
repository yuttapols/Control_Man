const SAFE_EXTERNAL_SCHEMES: readonly string[] = ['http:', 'https:'];

export const DEFAULT_LANDING_URL = '/dashboard';

export function resolveUrl(value: string): URL | null {
  try {
    return new URL(value, window.location.origin);
  } catch {
    return null;
  }
}

export function sanitizeReturnUrl(
  value: string | null | undefined,
  fallback: string = DEFAULT_LANDING_URL,
): string {
  if (!value) {
    return fallback;
  }

  const normalized = value.trim();
  const isRelativePath = normalized.startsWith('/');
  const isProtocolRelative = normalized.startsWith('//') || normalized.startsWith('/\\');
  const hasScheme = normalized.includes(':');

  if (!isRelativePath || isProtocolRelative || hasScheme) {
    return fallback;
  }

  return normalized;
}

export function isSafeExternalUrl(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  const parsed = resolveUrl(value.trim());

  return parsed !== null && SAFE_EXTERNAL_SCHEMES.includes(parsed.protocol);
}

export function isTrustedApiUrl(requestUrl: string, apiBaseUrl: string): boolean {
  const base = resolveUrl(apiBaseUrl);
  const target = resolveUrl(requestUrl);

  if (base === null || target === null) {
    return false;
  }

  return target.origin === base.origin && target.pathname.startsWith(base.pathname);
}

export function joinUrl(base: string, path: string): string {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}
