import {AfterViewInit, Component, ComponentFactoryResolver, Input, OnDestroy, Type, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {distinctUntilKeyChanged, filter, map, tap} from 'rxjs/operators';
import {SubRouteOutletDirective} from './outlet.directive';
import {SubRouteService} from './sub-route.service';

@Component({
  selector: 'sub-route-outlet',
  template: `
    <ng-template subRouteOutlet></ng-template>`,
})
export class SubRouteComponent implements AfterViewInit, OnDestroy {
  @Input() name?: string;
  @ViewChild(SubRouteOutletDirective) outlet: SubRouteOutletDirective;
  subs = new Subscription();
  currentDepth;
  currentComponent;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private subRoute: SubRouteService) {
  }

  ngAfterViewInit() {
    this.currentDepth = this.subRoute.getDepth();
    console.log('Opening Depth', this.currentDepth);
    let currentSegment;
    this.subs.add(this.subRoute.topRoute$.pipe(
      filter(routeState => (routeState.segmentCount - 1) >= this.currentDepth - 1),
      map((routeState) => routeState.children[this.currentDepth - 1]),
      filter(val => !!val),
      tap((v) => console.log('Child', v)),
      filter(seg => seg !== currentSegment),
      tap(seg => currentSegment = seg),
    ).subscribe(({component}) => this.loadComponent(component)));

    this.subs.add(this.subRoute.topRoute$.pipe(
      filter(() => !!this.currentComponent),
      filter(routeState => (routeState.segmentCount - 1) < this.currentDepth),
      tap(seg => currentSegment = ''),
    ).subscribe(() => this.unloadComponent()));
  }

  ngOnDestroy() {
    console.log('Closing Depth', this.currentDepth);
    this.subRoute.removeDepth();
    this.subs.unsubscribe();
  }

  unloadComponent() {
    console.log('UNLOADING COMPONENT');
    this.outlet.viewContainerRef.clear();
  }

  loadComponent(component: Type<any>) {
    console.log('Loading Component', component);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

    const viewContainerRef = this.outlet.viewContainerRef;
    viewContainerRef.clear();

    this.currentComponent = viewContainerRef.createComponent(componentFactory);
  }
}
