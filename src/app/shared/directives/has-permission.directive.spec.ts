import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AuthSession } from '../../core/auth/auth.model';
import { AuthStore } from '../../core/auth/auth.store';
import { PERMISSIONS } from '../constants/permission.constant';
import { HasPermissionDirective } from './has-permission.directive';

@Component({
  selector: 'app-permission-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HasPermissionDirective],
  template: `
    <button type="button" *appHasPermission="required()">สร้างวันหยุด</button>
  `,
})
class PermissionHost {
  readonly required = signal<string | readonly string[]>(PERMISSIONS.holidayCreate);
}

const session: AuthSession = {
  accessToken: 'token',
  expiresIn: 900,
  user: {
    id: 'user-1',
    username: 'editor',
    displayName: 'สมชาย ผู้บันทึก',
    email: 'editor@example.local',
    userLevel: 'Officer',
    roles: ['HOLIDAY_EDITOR'],
    permissions: [PERMISSIONS.holidayCreate],
    status: 'ACTIVE',
  },
};

describe('HasPermissionDirective', () => {
  it('renders nothing while the permission is missing', async () => {
    const fixture = TestBed.createComponent(PermissionHost);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('button')).toBeNull();
  });

  it('renders the element once the permission is granted', async () => {
    const fixture = TestBed.createComponent(PermissionHost);
    TestBed.inject(AuthStore).setSession(session);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('button')).not.toBeNull();
  });

  it('removes the element when the requirement changes to a denied permission', async () => {
    const fixture = TestBed.createComponent(PermissionHost);
    TestBed.inject(AuthStore).setSession(session);
    await fixture.whenStable();

    fixture.componentInstance.required.set(PERMISSIONS.approvalLevel2Approve);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('button')).toBeNull();
  });

  it('accepts a list and grants access when any code matches', async () => {
    const fixture = TestBed.createComponent(PermissionHost);
    TestBed.inject(AuthStore).setSession(session);
    fixture.componentInstance.required.set([PERMISSIONS.settingRead, PERMISSIONS.holidayCreate]);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('button')).not.toBeNull();
  });
});
