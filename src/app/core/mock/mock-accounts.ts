import { AuthenticatedUser } from '../auth/auth.model';
import { PERMISSIONS } from '../../shared/constants/permission.constant';

export interface MockAccount {
  username: string;
  password: string;
  user: AuthenticatedUser;
}

export const MOCK_PASSWORD = 'Password123!';

const BASE_PERMISSIONS: readonly string[] = [PERMISSIONS.dashboardRead, PERMISSIONS.calendarRead];

const ALL_PERMISSIONS: readonly string[] = Object.values(PERMISSIONS);

export const MOCK_ACCOUNTS: readonly MockAccount[] = [
  buildAccount('admin', 'ผู้ดูแลระบบ ทดสอบ', 'Director', ['SUPER_ADMIN'], ALL_PERMISSIONS),
  buildAccount('editor', 'สมชาย ผู้บันทึก', 'Officer', ['HOLIDAY_EDITOR'], [
    ...BASE_PERMISSIONS,
    PERMISSIONS.holidayRead,
    PERMISSIONS.holidayCreate,
    PERMISSIONS.holidaySubmit,
    PERMISSIONS.emergencyRead,
  ]),
  buildAccount('reviewer', 'สมหญิง ผู้ตรวจสอบ', 'Supervisor', ['HOLIDAY_REVIEWER_L1'], [
    ...BASE_PERMISSIONS,
    PERMISSIONS.holidayRead,
    PERMISSIONS.approvalInboxRead,
    PERMISSIONS.approvalLevel1Review,
    PERMISSIONS.emergencyRead,
    PERMISSIONS.auditRead,
  ]),
  buildAccount('approver', 'ประสิทธิ์ ผู้อนุมัติ', 'Manager', ['HOLIDAY_APPROVER_L2'], [
    ...BASE_PERMISSIONS,
    PERMISSIONS.holidayRead,
    PERMISSIONS.approvalInboxRead,
    PERMISSIONS.approvalLevel2Approve,
    PERMISSIONS.emergencyRead,
    PERMISSIONS.auditRead,
  ]),
  buildAccount('apiadmin', 'อรุณี ผู้ดูแล API', 'Manager', ['API_ADMIN'], [
    ...BASE_PERMISSIONS,
    PERMISSIONS.apiConsumerRead,
    PERMISSIONS.apiConsumerProdApprove,
    PERMISSIONS.auditRead,
  ]),
  buildAccount('auditor', 'วิชัย ผู้ตรวจสอบภายใน', 'Manager', ['AUDITOR'], [
    ...BASE_PERMISSIONS,
    PERMISSIONS.holidayRead,
    PERMISSIONS.approvalInboxRead,
    PERMISSIONS.emergencyRead,
    PERMISSIONS.apiConsumerRead,
    PERMISSIONS.userRead,
    PERMISSIONS.roleRead,
    PERMISSIONS.auditRead,
    PERMISSIONS.settingRead,
  ]),
  buildAccount('viewer', 'ผู้ใช้ทั่วไป ทดสอบ', 'Officer', ['VIEWER'], BASE_PERMISSIONS),
];

export function findMockAccount(username: string): MockAccount | undefined {
  const normalized = username.trim().toLowerCase();

  return MOCK_ACCOUNTS.find((account) => account.username === normalized);
}

export function findMockAccountById(id: string): MockAccount | undefined {
  return MOCK_ACCOUNTS.find((account) => account.user.id === id);
}

function buildAccount(
  username: string,
  displayName: string,
  userLevel: string,
  roles: readonly string[],
  permissions: readonly string[],
): MockAccount {
  return {
    username,
    password: MOCK_PASSWORD,
    user: {
      id: `mock-${username}`,
      username,
      displayName,
      email: `${username}@example.local`,
      userLevel,
      roles,
      permissions,
      status: 'ACTIVE',
    },
  };
}
