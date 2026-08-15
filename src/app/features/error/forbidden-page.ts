import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

import { PageState } from '../../shared/components/page-state/page-state';

@Component({
  selector: 'app-forbidden-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, PageState],
  template: `
    <app-page-state
      status="forbidden"
      title="ไม่มีสิทธิ์เข้าถึงหน้านี้ (403)"
      description="บัญชีของคุณไม่ได้รับสิทธิ์สำหรับหน้านี้ หากจำเป็นต้องใช้งาน กรุณาติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์เพิ่มเติม"
    />

    <div class="flex justify-center">
      <p-button label="กลับสู่หน้าแรก" icon="pi pi-home" routerLink="/dashboard" />
    </div>
  `,
})
export class ForbiddenPage {}
