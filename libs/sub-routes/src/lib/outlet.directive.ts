import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[subRouteOutlet]',
})
export class SubRouteOutletDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
