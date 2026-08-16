import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingStore {
  private readonly pendingRequests = signal(0);
  private readonly openModals = signal(0);

  readonly pendingCount = this.pendingRequests.asReadonly();
  readonly busy = computed(() => this.pendingRequests() > 0);
  readonly modalOpen = computed(() => this.openModals() > 0);

  readonly pageBusy = computed(() => this.busy() && !this.modalOpen());
  readonly modalBusy = computed(() => this.busy() && this.modalOpen());

  startRequest(): void {
    this.pendingRequests.update((count) => count + 1);
  }

  endRequest(): void {
    this.pendingRequests.update((count) => Math.max(0, count - 1));
  }

  registerModal(): void {
    this.openModals.update((count) => count + 1);
  }

  releaseModal(): void {
    this.openModals.update((count) => Math.max(0, count - 1));
  }
}
