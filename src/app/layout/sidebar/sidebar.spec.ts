import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthSession } from '../../core/auth/auth.model';
import { AuthStore } from '../../core/auth/auth.store';
import { PERMISSIONS } from '../../shared/constants/permission.constant';
import { Sidebar } from './sidebar';

function sessionWith(permissions: readonly string[]): AuthSession {
  return {
    accessToken: 'token',
    expiresIn: 900,
    user: {
      id: 'user-1',
      username: 'viewer',
      displayName: 'ผู้ใช้ทั่วไป ทดสอบ',
      email: 'viewer@example.local',
      userLevel: 'Officer',
      roles: ['VIEWER'],
      permissions,
      status: 'ACTIVE',
    },
  };
}

function renderedLabels(host: HTMLElement): string[] {
  return Array.from(host.querySelectorAll('a')).map((link) => link.textContent?.trim() ?? '');
}

describe('Sidebar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('shows only the menu items allowed by the session permissions', async () => {
    TestBed.inject(AuthStore).setSession(
      sessionWith([PERMISSIONS.dashboardRead, PERMISSIONS.calendarRead]),
    );

    const fixture = TestBed.createComponent(Sidebar);
    await fixture.whenStable();

    expect(renderedLabels(fixture.nativeElement as HTMLElement)).toEqual([
      'ภาพรวม',
      'ปฏิทินวันหยุด',
    ]);
  });

  it('adds administration menus for a privileged session', async () => {
    TestBed.inject(AuthStore).setSession(
      sessionWith([
        PERMISSIONS.calendarRead,
        PERMISSIONS.apiConsumerRead,
        PERMISSIONS.userRead,
        PERMISSIONS.auditRead,
        PERMISSIONS.settingRead,
      ]),
    );

    const fixture = TestBed.createComponent(Sidebar);
    await fixture.whenStable();

    const labels = renderedLabels(fixture.nativeElement as HTMLElement);

    expect(labels).toContain('ผู้ใช้ API');
    expect(labels).toContain('ผู้ใช้และสิทธิ์');
    expect(labels).toContain('ตั้งค่าระบบ');
    expect(labels).not.toContain('จัดการวันหยุด');
  });
});
