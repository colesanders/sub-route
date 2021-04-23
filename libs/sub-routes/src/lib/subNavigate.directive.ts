import {Directive, HostListener, Input} from '@angular/core';
import {SubRouteService} from './sub-route.service';

@Directive({
  selector: '[subNavigate]',
})
export class SubNavigateDirective {
  @Input() subNavigate: string;

  @HostListener('click')
  navigate() {
    this.route.push(this.subNavigate);
  }

  constructor(private route: SubRouteService) {
  }

}
