import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
} from '@angular/core';

import { PermissionService } from '../../core/auth/permission.service';

@Directive({ selector: '[appHasPermission]' })
export class HasPermissionDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly permissions = inject(PermissionService);

  readonly appHasPermission = input.required<string | readonly string[]>();

  private rendered = false;

  constructor() {
    effect(() => {
      const required = this.appHasPermission();
      const codes = Array.isArray(required) ? required : [required as string];
      const allowed = this.permissions.canAny(codes);

      if (allowed && !this.rendered) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.rendered = true;
        return;
      }

      if (!allowed && this.rendered) {
        this.viewContainer.clear();
        this.rendered = false;
      }
    });
  }
}
