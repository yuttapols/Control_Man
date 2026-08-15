import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

import { PageState } from '../../shared/components/page-state/page-state';

@Component({
  selector: 'app-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, PageState],
  template: `
    <app-page-state
      status="no-result"
      title="ไม่พบหน้าที่ต้องการ (404)"
      description="ลิงก์อาจถูกเปลี่ยนหรือถูกลบไปแล้ว กรุณาตรวจสอบที่อยู่หน้าเว็บอีกครั้ง"
    />

    <div class="flex justify-center">
      <p-button label="กลับสู่หน้าแรก" icon="pi pi-home" routerLink="/dashboard" />
    </div>
  `,
})
export class NotFoundPage {}
