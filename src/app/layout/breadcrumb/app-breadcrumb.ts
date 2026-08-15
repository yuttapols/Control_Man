import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { filter } from 'rxjs';

export const BREADCRUMB_DATA_KEY = 'breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Breadcrumb],
  template: `
    <p-breadcrumb
      [model]="items()"
      [home]="home"
      styleClass="border-none bg-transparent p-0 text-sm"
    />
  `,
})
export class AppBreadcrumb {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly navigationEnd = toSignal(
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)),
  );

  readonly home: MenuItem = { icon: 'pi pi-home', routerLink: '/dashboard', label: 'หน้าแรก' };

  readonly items = computed<MenuItem[]>(() => {
    this.navigationEnd();

    return buildTrail(this.route.snapshot.root);
  });
}

function buildTrail(root: ActivatedRouteSnapshot): MenuItem[] {
  const trail: MenuItem[] = [];
  const segments: string[] = [];
  let current: ActivatedRouteSnapshot | null = root;

  while (current) {
    const path = current.url.map((segment) => segment.path).join('/');

    if (path) {
      segments.push(path);
    }

    const label = current.data[BREADCRUMB_DATA_KEY] as string | undefined;

    if (label) {
      trail.push({ label, routerLink: `/${segments.join('/')}` });
    }

    current = current.firstChild;
  }

  return trail;
}
