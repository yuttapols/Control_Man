import { TranslationKey } from './th';

export const EN: Readonly<Record<TranslationKey, string>> = {
  'nav.ariaLabel': 'Main menu',
  'nav.dashboard': 'Overview',
  'nav.calendar': 'Holiday calendar',
  'nav.holidays': 'Manage holidays',
  'nav.approvals': 'Approval inbox',
  'nav.emergencies': 'Emergency requests',
  'nav.apiConsumers': 'API consumers',
  'nav.users': 'Users and permissions',
  'nav.auditLogs': 'Audit logs',
  'nav.settings': 'System settings',
  'nav.section.holidayData': 'Holiday data',
  'nav.section.approval': 'Approvals',
  'nav.section.administration': 'Administration',

  'layout.brandSubtitle': 'Holiday Control System',
  'layout.sidebarCollapse': 'Collapse main menu',
  'layout.sidebarExpand': 'Expand main menu',
  'layout.sidebarOpen': 'Open main menu',
  'layout.sidebarClose': 'Close main menu',
  'layout.notifications': 'Notifications',
  'layout.notificationsTooltip': 'Notifications will be enabled in a later phase',
  'layout.breadcrumbHome': 'Home',
  'layout.language': 'Language',
  'layout.languageTooltip': 'Change language',

  'user.role': 'Role',
  'user.noRole': 'No role assigned',
  'user.logout': 'Sign out',

  'env.aria': 'Current environment',
  'env.dev': 'DEV · Development',
  'env.uat': 'UAT · User testing',
  'env.prod': 'PROD · Production',

  'login.subtitle': 'Sign in to use the Holiday Control System',
  'login.username': 'Username or email',
  'login.password': 'Password',
  'login.rememberUsername': 'Remember username',
  'login.submit': 'Sign in',
  'login.contactAdmin': 'Forgot your password or locked out? Please contact your administrator.',
  'login.invalidCredentials': 'Incorrect username or password. Please check and try again.',
  'login.heroTitle': 'The hub for Thai public and bank holidays',
  'login.heroDescription':
    'Manage holidays with two-level approval, keep a full audit trail of every change, and publish to external systems through a web service.',
  'login.heroHighlight1': 'Public and bank holiday calendars in one place',
  'login.heroHighlight2': 'Two-level approval with an emergency workflow',
  'login.heroHighlight3': 'A full audit trail for every change',
  'login.heroFooter': 'Need additional access? Please contact your administrator.',

  'dashboard.greeting': 'Welcome, {name}',
  'dashboard.heroHint':
    'Use the menu on the left to view the holiday calendar, manage records, or review pending approvals.',
  'dashboard.emptyTitle': 'No widgets in this phase yet',
  'dashboard.emptyDescription':
    'Upcoming holidays, pending approvals, and API status will be enabled in a later phase.',

  'pageState.loading': 'Loading data',
  'pageState.requestId': 'Reference ID: {id}',
  'pageState.retry': 'Try again',
  'pageState.clearFilters': 'Clear filters',
  'pageState.emptyTitle': 'No data yet',
  'pageState.emptyDescription': 'Records will appear here once they exist in the system.',
  'pageState.noResultTitle': 'No records match your search',
  'pageState.noResultDescription': 'Try adjusting your search or clearing the filters.',
  'pageState.errorTitle': 'Something went wrong',
  'pageState.errorDescription': 'The data could not be loaded right now. Please try again.',
  'pageState.forbiddenTitle': 'You do not have access to this data',
  'pageState.forbiddenDescription':
    'Please contact your administrator if you need additional access.',

  'form.requiredMarker': 'required',
  'form.validationSummaryTitle': 'Please review the following',

  'validation.required': 'This field is required',
  'validation.requiredTrue': 'Please confirm this item before continuing',
  'validation.notBlank': 'This field cannot be only whitespace',
  'validation.email': 'Invalid email format',
  'validation.username':
    'Only letters, digits and . _ - @ are allowed, between 3 and 100 characters',
  'validation.minlength': 'Must be at least {length} characters',
  'validation.maxlength': 'Must not exceed {length} characters',
  'validation.min': 'Must not be less than {min}',
  'validation.max': 'Must not be greater than {max}',
  'validation.pattern': 'Invalid format',
  'validation.isoDate': 'Date must be in YYYY-MM-DD format',
  'validation.httpUrl': 'Must be a URL starting with http:// or https://',
  'validation.match': 'The values do not match',
  'validation.fallback': 'Invalid value',

  'notify.success': 'Success',
  'notify.info': 'Information',
  'notify.warn': 'Warning',
  'notify.error': 'Error',
  'notify.reference': ' (Reference ID: {id})',

  'error.message.network':
    'Cannot reach the server. Please check your internet connection and try again.',
  'error.message.badRequest': 'The submitted data is invalid. Please check it and try again.',
  'error.message.validation':
    'Some fields are invalid. Please review the reported items and try again.',
  'error.message.unauthenticated':
    'Your session has expired or you are not signed in. Please sign in again.',
  'error.message.accessDenied':
    'You do not have permission for this action. Please contact your administrator.',
  'error.message.notFound': 'The requested record was not found.',
  'error.message.stateConflict':
    'The status of this record has changed. Please reload before continuing.',
  'error.message.optimisticLock':
    'This record was modified by another user. Please reload before saving.',
  'error.message.duplicate': 'This record already exists in the system.',
  'error.message.businessRule': 'This action conflicts with a business rule.',
  'error.message.rateLimited': 'Too many requests. Please wait a moment and try again.',
  'error.message.internal': 'Something went wrong. Please try again.',
  'error.message.dependencyUnavailable':
    'The service is temporarily unavailable. Please try again later.',
  'error.message.fallback': 'An unexpected error occurred. Please try again.',

  'error.title.network': 'Connection failed',
  'error.title.validation': 'Invalid data',
  'error.title.unauthenticated': 'Sign-in required',
  'error.title.accessDenied': 'Not permitted',
  'error.title.notFound': 'Not found',
  'error.title.stateConflict': 'Status mismatch',
  'error.title.optimisticLock': 'Concurrent update',
  'error.title.duplicate': 'Duplicate record',
  'error.title.businessRule': 'Action not allowed',
  'error.title.internal': 'System error',
  'error.title.rateLimited': 'Too many requests',
  'error.title.dependencyUnavailable': 'Service unavailable',
  'error.title.fallback': 'Error',

  'error.unhandled':
    'An unexpected error occurred. Please try again, and contact your administrator if the problem persists.',
  'app.configLoadFailed':
    'Failed to load the system configuration. Falling back to development defaults.',

  'page.backHome': 'Back to home',
  'page.forbiddenTitle': 'You do not have access to this page (403)',
  'page.forbiddenDescription':
    'Your account is not granted access to this page. Please contact your administrator if you need it.',
  'page.notFoundTitle': 'Page not found (404)',
  'page.notFoundDescription':
    'The link may have been changed or removed. Please check the address and try again.',
  'page.serverErrorTitle': 'System error (500)',
  'page.serverErrorDescription':
    'The service is unavailable right now. Please try again, and report the reference ID below if the problem persists.',

  'route.login': 'Sign in',
  'route.dashboard': 'Overview',
  'route.forbidden': 'Access denied',
  'route.serverError': 'System error',
  'route.notFound': 'Page not found',
};
