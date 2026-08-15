export const CSRF_COOKIE = 'control_m_csrf';
export const CSRF_HEADER = 'X-CSRF-Token';

export function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  const match = document.cookie
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(prefix));

  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

export function csrfHeaders(token: string | null): Record<string, string> {
  const value = token ?? readCookie(CSRF_COOKIE);

  return value ? { [CSRF_HEADER]: value } : {};
}
