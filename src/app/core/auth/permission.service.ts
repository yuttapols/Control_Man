import { Injectable, inject } from '@angular/core';

import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly store = inject(AuthStore);

  can(code: string | null | undefined): boolean {
    if (!code) {
      return this.store.isAuthenticated();
    }

    return this.store.permissions().has(code);
  }

  canAny(codes: readonly string[]): boolean {
    if (codes.length === 0) {
      return this.store.isAuthenticated();
    }

    return codes.some((code) => this.can(code));
  }

  canAll(codes: readonly string[]): boolean {
    if (codes.length === 0) {
      return this.store.isAuthenticated();
    }

    return codes.every((code) => this.can(code));
  }
}
