# CLAUDE.md — Thai Holiday Control (Frontend)

Angular Portal ของระบบ **Thai Holiday Control** — ศูนย์กลางข้อมูลวันหยุดราชการ/ธนาคารไทย
ที่มี workflow อนุมัติ 2 ระดับ, Emergency workflow และเผยแพร่ผ่าน Web Service ให้ระบบภายนอก

Repo นี้คือ **frontend เท่านั้น** Backend (Java Spring Boot) และ Database (PostgreSQL) อยู่คนละ repo

---

## 1. Source of Truth

เอกสารออกแบบทั้งหมดอยู่ที่ `C:\GIT\DOCUMENT\Control_Man_Document` — **ห้ามเดา requirement เอง อ่านจากที่นี่**

| เรื่อง | ไฟล์ |
|---|---|
| Roles & permission matrix | `docs/04-USER-ROLES.md` |
| Business rules (BR-*) | `docs/05-BUSINESS-RULES.md` |
| Workflow / state machine | `docs/06-WORKFLOWS.md` |
| Sitemap, menu ตาม role, URL | `docs/07-INFORMATION-ARCHITECTURE.md` |
| UX flows, page states, confirmation policy | `docs/08-UX-FLOWS.md` |
| Wireframes ทุกหน้า | `docs/09-UI-WIREFRAMES.md` |
| Design system, tokens, สี, PrimeNG mapping | `docs/10-UI-DESIGN-SYSTEM.md` |
| Data dictionary (ที่มาของ model fields) | `docs/12-DATA-DICTIONARY.md` |
| API contract, error contract, pagination | `docs/13-API-DESIGN.md` |
| Auth / token model | `docs/14-AUTHENTICATION.md` |
| Permission codes, policy matrix | `docs/15-AUTHORIZATION.md` |
| งานของ FE แต่ละ phase | `docs/frontend/FE-PHASE-*.md` |
| FE/BE contract ownership | `docs/22-INTEGRATION-MATRIX.md` |

**BE เป็นเจ้าของ OpenAPI contract** ระหว่างที่ contract ยังไม่นิ่ง FE เดินด้วย mock ใน `core/mock/`
และ mark `TODO(contract)` ไว้ที่ service ไม่ใช่ที่ component

---

## 2. Tech Stack (ที่ติดตั้งจริงแล้ว)

| Package | Version | หมายเหตุ |
|---|---|---|
| Angular | 21.2 | standalone + **zoneless** + signals |
| PrimeNG | 21.1 + `@primeuix/themes` (Aura) | v22 ต้องใช้ Angular 22 |
| @angular/cdk | 21 | PrimeNG peer dependency |
| Tailwind CSS | 4.1 (CSS-first, `@theme` ใน `styles.css`) + `tailwindcss-primeui` | |
| PrimeIcons | 8 | |
| Test runner | **Vitest** (`@angular/build:unit-test`) + jsdom | ใช้ `vi.spyOn` ไม่ใช่ jasmine |
| Lint | `angular-eslint` 21 + typescript-eslint | |

> ทำไมไม่ใช้ Angular 22: Node ในเครื่องคือ v24.14.1 แต่ Angular 22 ต้องการ ≥ v24.15.0
> ถ้าอัปเกรด Node แล้วค่อย `ng update` ขึ้น 22 พร้อม PrimeNG 22 ได้

### Commands

```
npm start          # ng serve
npm run build      # production build
npm test           # vitest (single run)
npm run lint       # eslint
```

---

## 3. Coding Rules (ผู้ใช้กำหนดชัดเจน)

1. **ห้ามเขียน comment ใน code** ทุกไฟล์ — ตั้งชื่อให้อ่านรู้เรื่องแทน
   ข้อยกเว้นเดียว: `TODO(contract):` เมื่อรอ API contract จริง
2. **อะไรที่ซ้ำ ต้องดึงเป็น function กลาง** ห้าม copy-paste logic ข้าม component/service
   ก่อนเขียนของใหม่ ให้เช็ค `core/` และ `shared/` ก่อนเสมอ — เจอซ้ำครั้งที่ 2 refactor ทันที
3. Component ใช้ `ChangeDetectionStrategy.OnPush` เสมอ
4. ใช้ signals (`signal`, `computed`, `input()`, `output()`, `toSignal`) ไม่ใช้ decorator `@Input()/@Output()`
5. ใช้ `inject()` ไม่ใช้ constructor injection
6. ห้าม `any` — ไม่รู้ type ให้ประกาศ interface ใน `models/`
7. ห้าม business rule ซ้ำระหว่าง FE/BE — FE validate เพื่อ **UX เท่านั้น** ตัวจริงบังคับที่ Backend
8. ไม่ hard-code สี/ระยะ — ใช้ Tailwind utility ของ primeui (`surface-*`, `primary-*`) หรือ CSS var (`--p-*`)
9. ไฟล์/โฟลเดอร์ `kebab-case`; ใช้ Angular 2025 file-name style: `login-page.ts` class `LoginPage`,
   `sidebar.ts` class `Sidebar` (ไม่มี suffix `.component`)
10. Template ยาวเกิน ~120 บรรทัดค่อยแยกเป็น `.html` ที่เหลือใช้ inline template ตามของเดิม

---

## 4. Folder Structure (ของจริงในตอนนี้)

```
public/config/config.json         runtime config ต่อ Environment (ไม่ผ่าน build)
src/app/
  core/
    api/api.service.ts            HTTP wrapper + แกะ data/meta + toHttpParams
    auth/                         auth.model, auth.store, auth.service, permission.service, auth.guard
    config/                       app-config.model, app-config.service (โหลด config.json ตอน bootstrap)
    error/                        problem-detail.ts, app-error-handler.ts
    http/                         correlation / error / auth interceptors
    mock/                         mock-accounts.ts, mock-api.interceptor.ts
    notification/                 notification.service.ts (ครอบ PrimeNG MessageService)
    utils/url.util.ts             sanitizeReturnUrl, isTrustedApiUrl, isSafeExternalUrl, joinUrl
  shared/
    components/                   page-state, page-header, form-field, validation-summary, environment-badge
    constants/permission.constant.ts
    directives/has-permission.directive.ts
    models/                       api.model.ts (envelope/paging/ProblemDetail), enums.ts
    validation/                   app-validators, validation-messages, form-error.util
  features/
    auth/login-page.ts
    dashboard/dashboard-page.ts
    error/forbidden-page.ts | not-found-page.ts | server-error-page.ts
  layout/                         app-shell, topbar, sidebar, breadcrumb, nav.config.ts
```

กติกา:
- `features/*` ห้าม import ข้าม feature กันเอง ของที่ใช้ร่วมต้องย้ายขึ้น `shared/`
- `core/` โหลดครั้งเดียว ห้าม component ธรรมดา import service จาก feature อื่น
- แต่ละ feature ใหม่: `*-page.ts`, `components/`, `services/`, `models/`

---

## 5. API Contract & Models

Base path: `/api/v1/portal/...` (Portal, JWT Bearer) — `/api/v1/holidays/...` เป็นของ consumer ใช้ API key
**FE ห้ามเรียกและห้ามฝัง API key เด็ดขาด**

Envelope กลางอยู่ที่ `shared/models/api.model.ts` แล้ว: `ApiResponse<T>`, `ApiMeta`, `PageMeta`,
`PageRequest`, `PagedResult<T>`, `ProblemDetail`, `FieldError`, `QueryParams`, `DEFAULT_PAGE_SIZE`

`ApiService` เป็นตัวเดียวที่แกะ `data`/`meta` — component ไม่ต้องรู้จัก envelope

### Naming convention ของ model

- Request: `<Action><Entity>Request` เช่น `CreateHolidayRequest`, `SubmitRevisionRequest`, `ApprovalDecisionRequest`
- Response: `<Entity>Response` (detail), `<Entity>ListItem` (row ในตาราง), `<Entity>SummaryResponse` (widget)
- Query param object: `<Entity>Query extends PageRequest`
- Form model ภายในหน้า: `<Entity>FormValue` — **แยกจาก Request** แล้ว map ผ่าน `to<Entity>Request()`

### ตัวอย่างที่จะใช้ใน FE2 (อ้าง `docs/12-DATA-DICTIONARY.md`)

```ts
export interface HolidayListItem {
  id: string;
  holidayCode: string;
  holidayDate: string;
  nameTh: string;
  nameEn: string | null;
  holidayType: HolidayType;
  calendars: CalendarCode[];
  workflowStatus: WorkflowStatus;
  revisionNo: number;
  updatedAt: string;
}

export interface CreateHolidayRequest {
  holidayDate: string;
  nameTh: string;
  nameEn?: string;
  holidayType: HolidayType;
  calendarCodes: CalendarCode[];
  isSubstitute: boolean;
  substituteForId?: string;
  sourceReferenceNo?: string;
  sourceUrl?: string;
  note?: string;
}

export interface UpdateHolidayRequest extends CreateHolidayRequest {
  changeReason: string;
  version: number;
}
```

- วันที่ใน request/response เป็น **string ISO** (`YYYY-MM-DD` หรือ ISO-8601 UTC) ไม่ส่ง `Date` object
- ปีภายในใช้ **ค.ศ.** เสมอ พ.ศ. ใช้แค่ตอนแสดงผล (BR-HOL-010)
- ทุก entity ที่แก้ไขได้ต้องมี `version` และส่งกลับตอน update เพื่อกัน lost update (409)

---

## 6. Enums & Permission Codes

`shared/models/enums.ts` ตอนนี้มี `AppEnvironment`, `UserStatus`, `ActorType`
FE2 ค่อยเพิ่ม `WorkflowStatus`, `HolidayType`, `CalendarCode`, `EmergencyType`, `ImpactLevel`, `ApprovalAction`

Label ภาษาไทยของ status ต้องอยู่ใน **map เดียว** (`shared/constants/status.constant.ts` — สร้างตอน FE2)
แล้วใช้ผ่าน `StatusTag` component ห้ามเขียน `switch` แปลสถานะกระจายตาม component

Permission code อยู่ที่ `shared/constants/permission.constant.ts` (`PERMISSIONS.holidayCreate` ฯลฯ)
รูปแบบ `module.resource.action` — **ค่าปัจจุบันเป็นข้อสมมติของ FE รอ BE1 ยืนยัน**

---

## 7. Auth & Permission (implement แล้ว)

- Access JWT อยู่ **ใน memory (signal) ที่ `AuthStore` เท่านั้น** — ไม่มีใน localStorage/sessionStorage/URL/log
- Refresh token เป็น HttpOnly cookie ฝั่ง server → FE ส่งแค่ `withCredentials: true` ที่ login/refresh/logout
- `authInterceptor` แนบ Bearer เฉพาะ URL ที่ผ่าน `isTrustedApiUrl()` และข้าม endpoint `login`/`refresh`
- **Single-flight refresh**: 401 พร้อมกันหลาย request → refresh ครั้งเดียว → retry ทุกตัว (retry ได้ครั้งเดียว)
  refresh พังหรือ retry แล้วยัง 401 → `handleSessionExpired()` เคลียร์ state + ไป `/login?returnUrl=...`
- `returnUrl` ผ่าน `sanitizeReturnUrl()` เสมอ (กัน open redirect)
- Guard: `authGuard`, `guestGuard`, `permissionGuard(...codes)` → เด้ง `/403`
- Template ใช้ `*appHasPermission="'code'"` หรือ array ห้ามเช็ค role string ตรง ๆ
- **Guard/การซ่อนเมนูคือ UX ไม่ใช่ security** — Backend เป็นตัวบังคับจริง (BR-SEC-002)

### Runtime config (FE1-03)

`public/config/config.json` โหลดตอน `provideAppInitializer` ก่อน bootstrap → เปลี่ยน API origin/Environment
ได้โดย **ไม่ต้อง build ใหม่** (ตรงกับนโยบาย promote artifact เดียวกัน DEV→UAT→PROD)
ห้ามใส่ secret ในไฟล์นี้ ถ้าโหลดไม่สำเร็จ ระบบใช้ค่า fallback DEV และขึ้น banner เตือน

### Mock backend (DEV เท่านั้น)

`useMockApi: true` → `mockApiInterceptor` ตอบ `/auth/login|refresh|logout|me`
บัญชีทดสอบ (รหัสผ่านเดียวกันหมด `Password123!`): `admin`, `editor`, `reviewer`, `approver`,
`apiadmin`, `auditor`, `viewer` — แต่ละคนมี permission ต่างกันตาม `docs/07-INFORMATION-ARCHITECTURE.md`

---

## 8. UX/UI Standards (บังคับทุกหน้า)

### Page states — ใช้ `PageState` component ตัวกลาง (`status`: ready/loading/empty/no-result/error/forbidden)

| State | พฤติกรรม |
|---|---|
| Loading | Skeleton ที่รักษารูปทรงหน้า ไม่ใช้ full-page spinner |
| Empty | บอกเหตุผล + เสนอ action |
| No result | แยกจาก Empty + ปุ่มล้างตัวกรอง |
| Validation error | ขึ้นใต้ field (`FormField`) + summary ด้านบนเมื่อผิดหลายจุด (`ValidationSummary`) |
| Server error | แสดง `requestId` ไม่เปิดรายละเอียดภายใน |
| Forbidden | บอกว่าไม่มีสิทธิ์ + ช่องทางติดต่อผู้ดูแล |
| Session expired | กลับ login แล้วพากลับหน้าเดิม |
| Concurrent update (409) | แจ้งข้อมูลเปลี่ยน + ปุ่ม reload/compare **ห้ามเงียบ** |

### Validation (ชั้นกลางอยู่ที่ `shared/validation/`)

- `AppValidators`: `notBlank`, `username`, `password`, `isoDate`, `httpUrl`, `maxTrimmedLength`, `match`
- `VALIDATION_MESSAGES`: ข้อความไทยรวมที่เดียว — เพิ่ม validator ใหม่ต้องเพิ่มข้อความที่นี่ด้วย
- `controlErrorText()` แสดง error เมื่อ touched/dirty เท่านั้น และ **serverError มาก่อน client error**
- `applyServerFieldErrors(form, problem)` map `ProblemDetail.errors[]` เข้า control และคืนตัวที่ map ไม่ได้
  ให้ไปแสดงรวมด้านบน; `clearServerFieldErrors(form)` เรียกก่อน submit ทุกครั้ง
- `FormField` ผูก label/help/error เข้ากับ input ด้วย `describedByIds(controlId)` (a11y)

### Confirmation policy

- Save draft → ไม่ต้อง modal
- Submit / Pass / Approve / Reject / Publish / Revoke / Cancel → **ต้อง** ConfirmDialog + สรุปผลกระทบ
- Reject / Return / Revoke / Cancel → **ต้องพิมพ์เหตุผล**
- Action ที่กระทบ PROD ต้องระบุชื่อ Environment และ target ใน confirmation
- สำเร็จ → Toast (`NotificationService`); error ที่ต้องแก้ **ห้ามใช้ Toast อย่างเดียว** ต้องมี inline

### Form / Table / Visual

- Label เหนือ field, required มี `*`, help แยกจาก error, validate ตอน blur + submit
- ปุ่มหลักขวา ปุ่มรองซ้าย; ปุ่ม disable ต้องบอกเหตุผล (สำคัญกับ separation-of-duties)
- Table: search + filter + clear + result count + server-side paging; filter sync กับ URL query
- Action สำคัญใช้ข้อความ ไม่ใช้ icon เดี่ยว ๆ; ยังไม่มี bulk action ใน MVP
- Semantic color: Primary=blue, Success=green, Warning=amber, Danger=red, Neutral=gray
- Calendar: Government=blue, Bank=red, Both=purple, Substitute=`◇`
- **ห้ามสื่อสถานะด้วยสีอย่างเดียว** ต้องมีข้อความหรือ icon เสมอ
- Environment badge: DEV ฟ้า / UAT เหลืองอำพัน / PROD แดงเข้ม (component `EnvironmentBadge`)
- Spacing 4px scale, sidebar `w-64` (256px), form control สูง ≥40px, body text 15px, `lang="th"`

### Accessibility (เป้า WCAG 2.1 AA)

keyboard ครบทุก flow · focus indicator ชัด (`:focus-visible` global) · error ผูก field ด้วย
`aria-describedby` · `role="alert"` สำหรับ error · modal trap focus · ไม่ใช้ icon เปล่าเป็น action
· ESLint เปิด `templateAccessibility` แล้ว — lint ต้องผ่าน

---

## 9. ฟังก์ชันกลาง (ห้ามเขียนซ้ำ)

| ที่อยู่ | หน้าที่ | สถานะ |
|---|---|---|
| `core/api/api.service.ts` | CRUD + แกะ data/meta + `toHttpParams` (ตัดค่าว่างอัตโนมัติ) | ✅ |
| `core/error/problem-detail.ts` | normalize error ทุกชนิด → `ProblemDetail`, ข้อความไทยตาม status | ✅ |
| `core/http/*.interceptor.ts` | correlation id, error → toast/normalize, bearer + single-flight refresh | ✅ |
| `core/notification/notification.service.ts` | success/info/warn/error/problem | ✅ |
| `core/utils/url.util.ts` | return URL, trusted API URL, safe external URL, join | ✅ |
| `core/auth/permission.service.ts` | `can` / `canAny` / `canAll` | ✅ |
| `shared/validation/*` | validators + ข้อความ + map error จาก server | ✅ |
| `shared/components/page-state` | loading/empty/no-result/error/forbidden | ✅ |
| `shared/components/form-field` + `validation-summary` | label/help/error + a11y | ✅ |
| `shared/components/page-header` / `environment-badge` | หัวหน้า + badge environment | ✅ |
| `shared/directives/has-permission.directive.ts` | ซ่อน element ตามสิทธิ์ | ✅ |
| `core/utils/date.util.ts` | ISO ↔ Date, พ.ศ./ค.ศ., format ไทย | FE2 |
| `core/utils/query-param.util.ts` | sync filter ↔ URL query | FE2 |
| `shared/components/data-table` / `filter-bar` / `status-tag` | ตาราง + ตัวกรอง + สถานะ | FE2 |
| `shared/components/confirm-action` / `reason-dialog` | confirmation + บังคับกรอกเหตุผล | FE3 |
| `shared/components/revision-diff` | เทียบ revision + highlight | FE3 |
| `shared/components/secret-once-dialog` | แสดง secret ครั้งเดียว | FE4 |

---

## 10. Routes

```
/login                     guestGuard
/dashboard                 authGuard
/403  /error  /**          authGuard (หน้า error กลาง)
```

FE2+ ค่อยเพิ่ม `/holidays`, `/holidays/calendar`, `/approvals`, `/emergencies`, `/api-consumers`,
`/users`, `/roles`, `/audit-logs`, `/settings` — ทุก route ต้องมี `authGuard` + `permissionGuard`
และใส่ `data: { breadcrumb }` + `title` ให้ครบ (breadcrumb component อ่านจากตรงนี้)

เมนู sidebar อ่านจาก `layout/nav.config.ts` — เพิ่มหน้าใหม่ต้องเพิ่ม permission ที่นี่ด้วย

---

## 11. Phase Plan

| Phase | ขอบเขต | สถานะ |
|---|---|---|
| FE1 | Workspace, PrimeNG/Tailwind, runtime config, app shell, login, token state, interceptor + single-flight refresh, guards, permission directive, หน้า error/403/404, validation layer, unit tests | **READY_FOR_REVIEW** (รอ BE1 contract จริงเพื่อปิด integration) |
| FE2 | Dashboard, annual calendar, holiday list/form/detail/history, substitute, review&submit, 409 handling | `NOT_STARTED` |
| FE3 | Approval inbox, revision compare, L1/L2 actions, SoD UX, timeline, emergency, post-review | `NOT_STARTED` |
| FE4 | API consumer/credential, user/role, audit, settings, production hardening, regression | `NOT_STARTED` |

ค้างจาก FE1 (ต้องทำตอน BE1 พร้อม): ยืนยัน permission code จริง, endpoint/error contract จริง,
ปิด `useMockApi`, ทดสอบ integration login→refresh→logout กับ BE จริง, E2E ยังไม่มี (FE2 ค่อยเลือก tool)

---

## 12. ห้ามเด็ดขาด

- เก็บ token/secret ใน localStorage, URL, log, analytics (localStorage ใช้ได้เฉพาะ "จดจำ username")
- ฝัง API consumer key (`X-API-Key`) ใน Angular
- commit ค่า secret/endpoint จริงของ UAT/PROD
- `innerHTML` กับข้อมูลจากผู้ใช้/API, เปิด `sourceUrl` โดยไม่ผ่าน `isSafeExternalUrl()`
- ถือว่า guard/การซ่อนเมนู = security
- ทำ Import/Export หรือ upload ไฟล์ประกาศ (นอก MVP)
- ขยาย scope ข้าม phase โดยไม่ถามผู้ใช้ก่อน (`AGENTS.md`: เสนอ → รออนุมัติ → ทำ)

---

## 13. Working Agreement

ก่อนลงมือทุกงานใหญ่: เสนอแนวทาง + สรุป scope/ไฟล์ที่กระทบ → รอผู้ใช้อนุมัติ → ค่อยแก้ไฟล์
ทุกครั้งที่จบงาน ต้อง `npm run lint` + `npm test` + `npm run build` ให้ผ่านก่อนรายงาน
ถ้ามี decision ใหม่ที่กระทบการออกแบบ ให้เตือนผู้ใช้ว่าควรอัปเดต `docs/CONTEXT-SUMMARY.md`
และ `docs/DECISION-LOG.md` ใน repo เอกสาร
