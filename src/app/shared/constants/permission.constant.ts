export const PERMISSIONS = {
  dashboardRead: 'dashboard.summary.read',
  calendarRead: 'holiday.published.read',
  holidayRead: 'holiday.revision.read',
  holidayCreate: 'holiday.revision.create',
  holidaySubmit: 'holiday.revision.submit',
  approvalInboxRead: 'approval.inbox.read',
  approvalLevel1Review: 'approval.level1.review',
  approvalLevel2Approve: 'approval.level2.approve',
  emergencyRead: 'emergency.request.read',
  emergencyCreate: 'emergency.request.create',
  emergencyApprove: 'emergency.request.approve',
  apiConsumerRead: 'api-consumer.read',
  apiConsumerProdApprove: 'api-consumer.prod.approve',
  userRead: 'user.account.read',
  userRoleAssign: 'user.role.assign',
  roleRead: 'role.permission.read',
  auditRead: 'audit.log.read',
  settingRead: 'setting.system.read',
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
