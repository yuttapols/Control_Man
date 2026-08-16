import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { I18nService } from '../../core/i18n/i18n.service';
import { PageState } from '../../shared/components/page-state/page-state';

@Component({
  selector: 'app-server-error-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageState],
  template: `
    <app-page-state
      status="error"
      [title]="i18n.t('page.serverErrorTitle')"
      [description]="i18n.t('page.serverErrorDescription')"
      [requestId]="requestId()"
      [showRetry]="true"
      (retry)="reload()"
    />
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
