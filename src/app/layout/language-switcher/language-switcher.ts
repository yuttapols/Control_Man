import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Tooltip } from 'primeng/tooltip';

import { I18nService } from '../../core/i18n/i18n.service';
import { AppLanguage, LANGUAGE_OPTIONS, flagClassOf } from '../../core/i18n/language.model';

@Component({
  selector: 'app-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Menu, Tooltip],
  template: `
    <button
      type="button"
      class="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      aria-haspopup="true"
      aria-controls="language-menu"
      [attr.aria-label]="i18n.t('layout.languageTooltip')"
      [pTooltip]="i18n.t('layout.languageTooltip')"
      tooltipPosition="bottom"
      (click)="languageMenu.toggle($event)"
    >
      <span class="{{ currentFlagClass() }}" aria-hidden="true"></span>
      <span class="hidden sm:inline">{{ currentName() }}</span>
      <i class="pi pi-angle-down text-xs" aria-hidden="true"></i>
    </button>

    <p-menu #languageMenu id="language-menu" [model]="menuItems()" [popup]="true" />
  `,
})
export class LanguageSwitcher {
  protected readonly i18n = inject(I18nService);

  readonly currentName = computed(
    () => LANGUAGE_OPTIONS.find((option) => option.code === this.i18n.language())?.nativeName ?? '',
  );

  readonly currentFlagClass = computed(() => flagClassOf(this.i18n.language()));

  readonly menuItems = computed<MenuItem[]>(() => [
    {
      label: this.i18n.t('layout.language'),
      items: LANGUAGE_OPTIONS.map((option) => ({
        label: option.nativeName,
        icon: option.flagClass,
        styleClass: option.code === this.i18n.language() ? 'app-language-selected' : '',
        command: () => this.select(option.code),
      })),
    },
  ]);

  private select(language: AppLanguage): void {
    this.i18n.setLanguage(language);
  }
}
