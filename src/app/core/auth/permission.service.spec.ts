import { TestBed } from '@angular/core/testing';

import { PERMISSIONS } from '../../shared/constants/permission.constant';
import { AuthSession } from './auth.model';
import { AuthStore } from './auth.store';
import { PermissionService } from './permission.service';

const session: AuthSession = {
  accessToken: 'token',
  expiresIn: 900,
  user: {
    id: 'user-1',
    username: 'reviewer',
    displayName: 'สมหญิง ผู้ตรวจสอบ',
    email: 'reviewer@example.local',
    userLevel: 'Supervisor',
    roles: ['HOLIDAY_REVIEWER_L1'],
    permissions: [PERMISSIONS.approvalInboxRead, PERMISSIONS.approvalLevel1Review],
    status: 'ACTIVE',
  },
};

describe('PermissionService', () => {
  let permissions: PermissionService;
  let store: AuthStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    permissions = TestBed.inject(PermissionService);
    store = TestBed.inject(AuthStore);
  });

  it('denies everything while signed out', () => {
    expect(permissions.can(PERMISSIONS.approvalInboxRead)).toBe(false);
    expect(permissions.canAny([])).toBe(false);
  });

  it('grants only the permissions carried by the session', () => {
    store.setSession(session);

    expect(permissions.can(PERMISSIONS.approvalLevel1Review)).toBe(true);
    expect(permissions.can(PERMISSIONS.approvalLevel2Approve)).toBe(false);
    expect(permissions.canAny([PERMISSIONS.userRead, PERMISSIONS.approvalInboxRead])).toBe(true);
    expect(permissions.canAll([PERMISSIONS.userRead, PERMISSIONS.approvalInboxRead])).toBe(false);
  });

  it('treats an empty requirement as authenticated only', () => {
    store.setSession(session);

    expect(permissions.canAny([])).toBe(true);
  });
});
