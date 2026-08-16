import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';

import { I18nService } from '../../core/i18n/i18n.service';
import { ErrorPageView } from './error-page-view';

@Component({
  selector: 'app-server-error-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ErrorPageView],
  template: `
    <app-error-page-view
      code="500"
      icon="pi-exclamation-triangle"
      tone="server"
      [title]="i18n.t('page.serverErrorTitle')"
      [description]="i18n.t('page.serverErrorDescription')"
      [requestId]="requestId()"
    >
      <p-button [label]="i18n.t('pageState.retry')" icon="pi pi-refresh" (onClick)="reload()" />
    </app-error-page-view>
  `,
})
export class ServerErrorPage {
  private readonly route = inject(ActivatedRoute);
  protected readonly i18n = inject(I18nService);
  private readonly router = inject(Router);

  readonly requestId = computed(() => this.route.snapshot.queryParamMap.get('requestId') ?? '');

  reload(): void {
    void this.router.navigateByUrl('/dashboard');
  }
}
