import { TranslationKey } from '../core/i18n/locales/th';
import { PERMISSIONS } from '../shared/constants/permission.constant';

export interface NavItem {
  labelKey: TranslationKey;
  icon: string;
  route: string;
  permissions: readonly string[];
}

export interface NavSection {
  titleKey: TranslationKey | null;
  items: readonly NavItem[];
}

export const NAV_SECTIONS: readonly NavSection[] = [
  {
    titleKey: null,
    items: [
      {
        labelKey: 'nav.dashboard',
        icon: 'pi pi-home',
        route: '/dashboard',
        permissions: [],
      },
    ],
  },
  {
    titleKey: 'nav.section.holidayData',
    items: [
      {
        labelKey: 'nav.calendar',
        icon: 'pi pi-calendar',
        route: '/holidays/calendar',
        permissions: [PERMISSIONS.calendarRead],
      },
      {
        labelKey: 'nav.holidays',
        icon: 'pi pi-list',
        route: '/holidays',
        permissions: [PERMISSIONS.holidayRead],
      },
    ],
  },
  {
    titleKey: 'nav.section.approval',
    items: [
      {
        labelKey: 'nav.approvals',
        icon: 'pi pi-check-square',
        route: '/approvals',
        permissions: [PERMISSIONS.approvalInboxRead],
      },
      {
        labelKey: 'nav.emergencies',
        icon: 'pi pi-exclamation-triangle',
        route: '/emergencies',
        permissions: [PERMISSIONS.emergencyRead],
      },
    ],
  },
  {
    titleKey: 'nav.section.administration',
    items: [
      {
        labelKey: 'nav.apiConsumers',
        icon: 'pi pi-share-alt',
        route: '/api-consumers',
        permissions: [PERMISSIONS.apiConsumerRead],
      },
      {
        labelKey: 'nav.users',
        icon: 'pi pi-users',
        route: '/users',
        permissions: [PERMISSIONS.userRead, PERMISSIONS.roleRead],
      },
      {
        labelKey: 'nav.auditLogs',
        icon: 'pi pi-history',
        route: '/audit-logs',
        permissions: [PERMISSIONS.auditRead],
      },
      {
        labelKey: 'nav.settings',
        icon: 'pi pi-cog',
        route: '/settings',
        permissions: [PERMISSIONS.settingRead],
      },
    ],
  },
];

export const NAV_ITEMS: readonly NavItem[] = NAV_SECTIONS.flatMap((section) => section.items);
