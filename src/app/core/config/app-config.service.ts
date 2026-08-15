import { Injectable, computed, signal } from '@angular/core';

import { APP_CONFIG_URL, AppConfig, FALLBACK_APP_CONFIG } from './app-config.model';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly state = signal<AppConfig>(FALLBACK_APP_CONFIG);
  private readonly loadFailed = signal(false);

  readonly config = this.state.asReadonly();
  readonly configLoadFailed = this.loadFailed.asReadonly();
  readonly appName = computed(() => this.state().appName);
  readonly environment = computed(() => this.state().environment);
  readonly apiBaseUrl = computed(() => this.state().apiBaseUrl);
  readonly useMockApi = computed(() => this.state().useMockApi);
  readonly isProduction = computed(() => this.state().environment === 'PROD');

  async load(): Promise<void> {
    try {
      const response = await fetch(APP_CONFIG_URL, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`Configuration request failed with status ${response.status}`);
      }

      const loaded = (await response.json()) as Partial<AppConfig>;

      this.state.set({ ...FALLBACK_APP_CONFIG, ...loaded });
      this.loadFailed.set(false);
    } catch {
      this.state.set(FALLBACK_APP_CONFIG);
      this.loadFailed.set(true);
    }
  }
}
