import { Injectable, computed, signal } from '@angular/core';

import { AuthSession, AuthenticatedUser } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly token = signal<string | null>(null);
  private readonly user = signal<AuthenticatedUser | null>(null);
  private readonly csrf = signal<string | null>(null);
  private readonly sessionRestored = signal(false);

  readonly accessToken = this.token.asReadonly();
  readonly currentUser = this.user.asReadonly();
  readonly csrfToken = this.csrf.asReadonly();
  readonly restored = this.sessionRestored.asReadonly();

  readonly isAuthenticated = computed(() => this.token() !== null && this.user() !== null);
  readonly permissions = computed(() => new Set<string>(this.user()?.permissions ?? []));
  readonly roles = computed<readonly string[]>(() => this.user()?.roles ?? []);
  readonly displayName = computed(() => this.user()?.displayName ?? '');
  readonly initials = computed(() => buildInitials(this.user()?.displayName ?? ''));

  setSession(session: AuthSession): void {
    this.token.set(session.accessToken);
    this.user.set(session.user);
    this.sessionRestored.set(true);

    if (session.csrfToken) {
      this.csrf.set(session.csrfToken);
    }
  }

  setAccessToken(accessToken: string): void {
    this.token.set(accessToken);
  }

  setCurrentUser(user: AuthenticatedUser): void {
    this.user.set(user);
  }

  markRestored(): void {
    this.sessionRestored.set(true);
  }

  clear(): void {
    this.token.set(null);
    this.user.set(null);
    this.csrf.set(null);
    this.sessionRestored.set(true);
  }
}

function buildInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}
