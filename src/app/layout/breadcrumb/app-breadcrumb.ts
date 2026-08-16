import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { filter } from 'rxjs';

import { I18nService } from '../../core/i18n/i18n.service';
import { TranslationKey } from '../../core/i18n/locales/th';

export const BREADCRUMB_DATA_KEY = 'breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Breadcrumb],
  template: `
    <p-breadcrumb
      [model]="items()"
      [home]="home()"
      styleClass="border-none bg-transparent p-0 text-sm"
    />
  `,
})
export class AppBreadcrumb {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly i18n = inject(I18nService);

  private readonly navigationEnd = toSignal(
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)),
  );

  readonly home = computed<MenuItem>(() => ({
    icon: 'pi pi-home',
    routerLink: '/dashboard',
    label: this.i18n.t('layout.breadcrumbHome'),
  }));

  readonly items = computed<MenuItem[]>(() => {
    this.navigationEnd();

    return buildTrail(this.route.snapshot.root, (key) => this.i18n.t(key));
  });
}

function buildTrail(
  root: ActivatedRouteSnapshot,
  translate: (key: TranslationKey) => string,
): MenuItem[] {
  const trail: MenuItem[] = [];
  const segments: string[] = [];
  let current: ActivatedRouteSnapshot | null = root;

  while (current) {
    const path = current.url.map((segment) => segment.path).join('/');

    if (path) {
      segments.push(path);
    }

    const labelKey = current.data[BREADCRUMB_DATA_KEY] as TranslationKey | undefined;

    if (labelKey) {
      trail.push({ label: translate(labelKey), routerLink: `/${segments.join('/')}` });
    }

    current = current.firstChild;
  }

  return trail;
}
