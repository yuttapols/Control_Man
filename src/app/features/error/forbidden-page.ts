import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

import { I18nService } from '../../core/i18n/i18n.service';
import { PageState } from '../../shared/components/page-state/page-state';

@Component({
  selector: 'app-forbidden-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, PageState],
  template: `
    <app-page-state
      status="forbidden"
      [title]="i18n.t('page.forbiddenTitle')"
      [description]="i18n.t('page.forbiddenDescription')"
    />

    <div class="flex justify-center">
      <p-button [label]="i18n.t('page.backHome')" icon="pi pi-home" routerLink="/dashboard" />
    </div>
  `,
})
export class ForbiddenPage {
  protected readonly i18n = inject(I18nService);
}
