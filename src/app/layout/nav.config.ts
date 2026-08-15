import { PERMISSIONS } from '../shared/constants/permission.constant';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  permissions: readonly string[];
}

export const NAV_ITEMS: readonly NavItem[] = [
  {
    label: 'ภาพรวม',
    icon: 'pi pi-home',
    route: '/dashboard',
    permissions: [],
  },
  {
    label: 'ปฏิทินวันหยุด',
    icon: 'pi pi-calendar',
    route: '/holidays/calendar',
    permissions: [PERMISSIONS.calendarRead],
  },
  {
    label: 'จัดการวันหยุด',
    icon: 'pi pi-list',
    route: '/holidays',
    permissions: [PERMISSIONS.holidayRead],
  },
  {
    label: 'กล่องงานอนุมัติ',
    icon: 'pi pi-check-square',
    route: '/approvals',
    permissions: [PERMISSIONS.approvalInboxRead],
  },
  {
    label: 'คำขอฉุกเฉิน',
    icon: 'pi pi-exclamation-triangle',
    route: '/emergencies',
    permissions: [PERMISSIONS.emergencyRead],
  },
  {
    label: 'ผู้ใช้ API',
    icon: 'pi pi-share-alt',
    route: '/api-consumers',
    permissions: [PERMISSIONS.apiConsumerRead],
  },
  {
    label: 'ผู้ใช้และสิทธิ์',
    icon: 'pi pi-users',
    route: '/users',
    permissions: [PERMISSIONS.userRead, PERMISSIONS.roleRead],
  },
  {
    label: 'บันทึกการตรวจสอบ',
    icon: 'pi pi-history',
    route: '/audit-logs',
    permissions: [PERMISSIONS.auditRead],
  },
  {
    label: 'ตั้งค่าระบบ',
    icon: 'pi pi-cog',
    route: '/settings',
    permissions: [PERMISSIONS.settingRead],
  },
];
