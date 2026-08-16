import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

import { I18nService } from '../../core/i18n/i18n.service';
import { ErrorPageView } from './error-page-view';

@Component({
  selector: 'app-forbidden-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, ErrorPageView],
  template: `
    <app-error-page-view
      code="403"
      icon="pi-lock"
      tone="forbidden"
      [title]="i18n.t('page.forbiddenTitle')"
      [description]="i18n.t('page.forbiddenDescription')"
    >
      <p-button [label]="i18n.t('page.backHome')" icon="pi pi-home" routerLink="/dashboard" />
    </app-error-page-view>
  `,
})
export class ForbiddenPage {
  protected readonly i18n = inject(I18nService);
}
