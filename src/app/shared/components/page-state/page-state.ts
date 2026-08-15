import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

export type PageStatus = 'ready' | 'loading' | 'empty' | 'no-result' | 'error' | 'forbidden';

interface StateCopy {
  icon: string;
  title: string;
  description: string;
  iconClass: string;
}

const STATE_COPY: Readonly<Record<Exclude<PageStatus, 'ready' | 'loading'>, StateCopy>> = {
  empty: {
    icon: 'pi pi-inbox',
    iconClass: 'text-surface-400',
    title: 'ยังไม่มีข้อมูล',
    description: 'เมื่อมีข้อมูลในระบบ รายการจะแสดงที่นี่',
  },
  'no-result': {
    icon: 'pi pi-search',
    iconClass: 'text-surface-400',
    title: 'ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา',
    description: 'ลองปรับคำค้นหรือล้างตัวกรองเพื่อดูรายการทั้งหมด',
  },
  error: {
    icon: 'pi pi-exclamation-triangle',
    iconClass: 'text-red-500',
    title: 'ระบบขัดข้อง',
    description: 'ไม่สามารถโหลดข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
  },
  forbidden: {
    icon: 'pi pi-lock',
    iconClass: 'text-amber-500',
    title: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้',
    description: 'หากต้องการสิทธิ์เพิ่มเติม กรุณาติดต่อผู้ดูแลระบบ',
  },
};

@Component({
  selector: 'app-page-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Skeleton],
  template: `
    @switch (status()) {
      @case ('ready') {
        <ng-content />
      }

      @case ('loading') {
        <div class="flex flex-col gap-3" role="status" aria-live="polite">
          <span class="sr-only">กำลังโหลดข้อมูล</span>
          @for (row of skeletonRows(); track row) {
            <p-skeleton height="2.5rem" styleClass="w-full" />
          }
        </div>
      }

      @default {
        <div
          class="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-surface-300 px-6 py-12 text-center"
          role="status"
          aria-live="polite"
        >
          <i class="pi text-4xl {{ copy().icon }} {{ copy().iconClass }}" aria-hidden="true"></i>
          <h2 class="text-base font-semibold text-surface-800">{{ title() || copy().title }}</h2>
          <p class="max-w-md text-sm text-surface-500">
            {{ description() || copy().description }}
          </p>

          @if (requestId()) {
            <p class="font-mono text-xs text-surface-400">รหัสอ้างอิง: {{ requestId() }}</p>
          }

          <div class="flex flex-wrap items-center justify-center gap-2">
            @if (showRetry()) {
              <p-button
                label="ลองใหม่อีกครั้ง"
                icon="pi pi-refresh"
                severity="secondary"
                (onClick)="retry.emit()"
              />
            }
            @if (showClearFilters()) {
              <p-button
                label="ล้างตัวกรอง"
                icon="pi pi-filter-slash"
                severity="secondary"
                [outlined]="true"
                (onClick)="clearFilters.emit()"
              />
            }
          </div>
        </div>
      }
    }
  `,
})
export class PageState {
  readonly status = input.required<PageStatus>();
  readonly title = input('');
  readonly description = input('');
  readonly requestId = input('');
  readonly skeletonCount = input(4);
  readonly showRetry = input(false);
  readonly showClearFilters = input(false);

  readonly retry = output<void>();
  readonly clearFilters = output<void>();

  readonly skeletonRows = computed(() =>
    Array.from({ length: this.skeletonCount() }, (_, index) => index),
  );

  readonly copy = computed<StateCopy>(() => {
    const status = this.status();

    return status === 'ready' || status === 'loading' ? STATE_COPY.error : STATE_COPY[status];
  });
}
