import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AuthStore } from '../../core/auth/auth.store';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { PageState } from '../../shared/components/page-state/page-state';

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, PageState],
  template: `
    <app-page-header title="ภาพรวม" [description]="greeting()" />

    <app-page-state
      status="empty"
      title="ยังไม่มีวิดเจ็ตในเฟสนี้"
      description="ข้อมูลวันหยุดที่กำลังจะมาถึง งานรออนุมัติ และสถานะ API จะเปิดใช้งานในเฟสถัดไป"
    />
  `,
})
export class DashboardPage {
  private readonly store = inject(AuthStore);

  readonly greeting = computed(() => `ยินดีต้อนรับ ${this.store.displayName()}`);
}
