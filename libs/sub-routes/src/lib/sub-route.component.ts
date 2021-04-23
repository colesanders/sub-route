import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
  SkipSelf,
  Type,
  ViewChild
} from '@angular/core';
import {merge, Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {extractChildren} from './operators';
import {SubRouteOutletDirective} from './outlet.directive';
import { provideParent, provideRouteTree} from './providers/sub-route.providers';
import {RouteTree, SimpleRoute} from './subroute.model';

export interface ChildEvent {
  event: string;
  data: any;
}

export const entryIsEventEmitter = ([, value]) => value instanceof EventEmitter;

export const toChildEvent = ([key, value]: [string, EventEmitter<any>]): Observable<ChildEvent> =>
  value.pipe(
    map(next => ({event: key, data: next})),
  );

export const createChildEvents = (component: ComponentRef<any>) =>
  Object.entries(component.instance).filter(entryIsEventEmitter).map(toChildEvent);

@Component({
  selector: 'sub-route-outlet',
  template: `
    <ng-template subRouteOutlet></ng-template>`,
  providers: [provideParent(SubRouteComponent), provideRouteTree(true)],
})
export class SubRouteComponent implements AfterViewInit, OnDestroy {
  @Input() name?: string;
  @ViewChild(SubRouteOutletDirective) outlet: SubRouteOutletDirective;
  @Output() childEvent = new EventEmitter();
  subs = new Subscription();
  childTree$?: Observable<SimpleRoute>;
  lastRendered: Type<any>;
  currentComponent: ComponentRef<any>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    @SkipSelf() @Optional() public routeTree$?: RouteTree
  ) {
    this.childTree$ = this.routeTree$.pipe(extractChildren());
  }

  ngAfterViewInit() {
    this.subs.add(
      this.childTree$.subscribe(route =>
        route.depth < route.segmentCount ? this.loadComponent(route.component) : this.unloadComponent()
      )
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  unloadComponent() {
    this.lastRendered = null;
    if (!this.currentComponent) {
      return;
    }
    console.log('ATTEMPTING TO UNLOAD COMPONENT', this.currentComponent);
    this.outlet.viewContainerRef.clear();
  }

  loadComponent(component: Type<any>) {
    if (component === this.lastRendered) {
      return;
    }
    this.lastRendered = component;
    console.log('Loading Component', component);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.outlet.viewContainerRef;
    viewContainerRef.clear();

    this.currentComponent = viewContainerRef.createComponent(componentFactory);

    this.subs.add(
      merge(...createChildEvents(this.currentComponent))
        .subscribe(data => this.childEvent.emit(data))
    );
  }
}
