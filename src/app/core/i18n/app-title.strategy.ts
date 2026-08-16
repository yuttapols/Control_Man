import { Injectable, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { AppConfigService } from '../config/app-config.service';
import { I18nService } from './i18n.service';
import { TranslationKey } from './locales/th';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly i18n = inject(I18nService);
  private readonly config = inject(AppConfigService);
  private readonly titleKey = signal<TranslationKey | null>(null);

  constructor() {
    super();

    effect(() => {
      const key = this.titleKey();
      const appName = this.config.appName();

      this.title.setTitle(key ? `${this.i18n.t(key)} · ${appName}` : appName);
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.titleKey.set((this.buildTitle(snapshot) as TranslationKey | undefined) ?? null);
  }
}
