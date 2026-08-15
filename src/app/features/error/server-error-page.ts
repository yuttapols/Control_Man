import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageState } from '../../shared/components/page-state/page-state';

@Component({
  selector: 'app-server-error-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageState],
  template: `
    <app-page-state
      status="error"
      title="ระบบขัดข้อง (500)"
      description="ไม่สามารถให้บริการได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง หากยังพบปัญหาให้แจ้งผู้ดูแลระบบพร้อมรหัสอ้างอิงด้านล่าง"
      [requestId]="requestId()"
      [showRetry]="true"
      (retry)="reload()"
    />
  `,
})
export class ServerErrorPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly requestId = computed(() => this.route.snapshot.queryParamMap.get('requestId') ?? '');

  reload(): void {
    void this.router.navigateByUrl('/dashboard');
  }
}
