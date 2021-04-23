import {Inject, Injectable, InjectionToken, Type} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ComponentProps} from '@ionic/core';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {from} from 'rxjs/internal/observable/from';
import {concatMap, map, switchMap, tap} from 'rxjs/operators';
import {SimpleRoute} from './subroute.model';

export const SUB_ROUTES = new InjectionToken('SubRoutes');

export const childMatchingSegment = (children: SimpleRoute[], segment: string) =>
  children.find(child => child.path === segment);

export const flattenTreeBySegments = (segments: string[], children: SimpleRoute[]) =>
  segments.reduce((prev: SimpleRoute[], seg, i) =>
      i === 0 ? [childMatchingSegment(children, seg)] : [...prev, childMatchingSegment(prev[i - 1].children, seg)],
    []);

@Injectable()
export class SubRouteService {
  routeStack: SimpleRoute[] = [];
  routeStack$ = new ReplaySubject<SimpleRoute[]>(1);
  modalStream$ = new Subject();

  constructor(private controller: ModalController,
              @Inject(SUB_ROUTES) private routes: SimpleRoute[],
  ) {
    console.log('Service Create', routes);
    this.modalStream$.subscribe(v => console.log('Stream, Next', v));
  }

  get topRoute() {
    return this.routeStack.length > 0 ? this.routeStack[this.routeStack.length - 1] : {path: ''};
  }

  private flattenRouteTree(segments: string[], route: SimpleRoute) {
    if (!segments || !route?.children) {
      return [];
    }

    return flattenTreeBySegments(segments, route.children);
  }

  push(route: string) {
    const segments = route.split('/');
    const root = this.routes.find(rt => rt.path === segments[0]);
    const flat = this.flattenRouteTree(segments.slice(1), root);
    this.pushSubRoute({
      url: route,
      segmentCount: segments.length,
      segments,
      path: segments[0],
      parent: root.component,
      children: flat,
      depth: 0
    });
  }

  private pushSubRoute(route: SimpleRoute) {
    // if (route.url === this.topRoute?.url) {
    //   console.log('Duplicate Route Detected!', route.url);
    //   return;
    // }
    if (this.topRoute?.path === route.path) {
      this.routeStack = [...this.routeStack.slice(0, this.routeStack.length - 1), route];
    } else {
      this.routeStack = [...this.routeStack, route];
      this.openRoute(route);
    }
    this.routeStack$.next(this.routeStack);
  }

  async pop(data?, role?: string) {
    const modal = await this.controller.getTop();
    await modal.dismiss(data, role);
    this.popSubRoute();
  }

  private popSubRoute() {
    this.routeStack = this.routeStack.slice(0, this.routeStack.length - 1);
    this.routeStack$.next(this.routeStack);
  }

  openRoute(route: SimpleRoute) {
    this.openModal(route.parent);
  }

  openModal<T>(component: Type<T>, props?: ComponentProps<T>): Observable<HTMLIonModalElement> {
    // Close top modal based on navigation stack?
    const p = async () => {
      const modal = await this.controller.create({
        component: component as any,
        componentProps: {
          dismiss: (data?, role?) => this.pop(data, role),
          props
        }
      });
      await modal.present();
      from(modal.onDidDismiss()).pipe(
        tap(v => console.log('Closing', v)),
        // map(r => ({...r, url: route.url}))
      ).subscribe((next) => this.modalStream$.next(next));
      return modal;
    };
    return from(p());
  }
}
