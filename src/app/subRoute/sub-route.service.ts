import {ComponentRef, EventEmitter, Inject, Injectable, InjectionToken, Type} from '@angular/core';
import {Route, Routes} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {ComponentProps} from '@ionic/core';
import {combineLatest, defer, iif, Observable, of, ReplaySubject, Subject} from 'rxjs';
import {from} from 'rxjs/internal/observable/from';
import {distinctUntilKeyChanged, filter, map, switchMap, tap} from 'rxjs/operators';
import {SubRouteFacade} from './sub-route.facade';
import {SimpleRoute} from './subroute.model';

export const SUB_ROUTES = new InjectionToken('SubRoutes');
export const CHILD_ROUTES = new InjectionToken('SubRoutesChildren');

export const childMatchingSegment = (children: Route[], segment: string) =>
  children.find(child => child.path === segment);

export const flattenTreeBySegments = (segments: string[], children: Route[]) =>
  segments.reduce((prev: Route[], seg, i) =>
      i === 0 ? [childMatchingSegment(children, seg)] : [...prev, childMatchingSegment(prev[i - 1].children, seg)],
    []);

export const START_DEPTH = 1;

@Injectable()
export class SubRouteService {
  routeStack: SimpleRoute[] = [];
  routeStack$ = new ReplaySubject<SimpleRoute[]>(1);
  topRoute$: Observable<SimpleRoute>;
  currentModal;
  modalStream$ = new Subject();
  depth = START_DEPTH;

  constructor(private controller: ModalController,
              @Inject(SUB_ROUTES) private routes: Routes,
              private facade: SubRouteFacade,
  ) {
    this.topRoute$ = this.routeStack$.pipe(
      tap(v => console.log('Route Stack', v)),
      map((rts) => rts[rts.length - 1]),
      filter(route => !!route),
      distinctUntilKeyChanged('url'),
      tap((v) => console.log('Parent', v)),
    );

    this.topRoute$.pipe(
      distinctUntilKeyChanged('path'),
      switchMap((route) =>
        this.openModal(route.parent).pipe(
          tap((modal) => this.currentModal = modal),
          switchMap((modal) => modal.onWillDismiss()),
          map(r => ({ ...r, url: route.url }))
        )
      ),
    ).subscribe(this.modalStream$);
  }

  get topRoute() {
    return this.routeStack[this.routeStack.length - 1];
  }

  getDepth(): number {
    this.depth += 1;
    return this.depth - 1;
  }

  removeDepth(): number {
    this.depth -= 1;
    return this.depth + 1;
  }

  private flattenRouteTree(segments: string[], route: Route) {
    if (!segments || !route?.children) {
      return [];
    }

    return flattenTreeBySegments(segments, route.children);
  }

  push(route: string) {
    const segments = route.split('/');
    const root = this.routes.find(rt => rt.path === segments[0]);
    const flat = this.flattenRouteTree(segments.slice(1), root);
    this.pushSubRoute({url: route, segmentCount: segments.length, path: segments[0], parent: root.component, children: flat});
  }

  pop() {
    this.currentModal.dismiss();
    this.popSubRoute();
  }

  private pushSubRoute(route: SimpleRoute) {
    if (route.url === this.topRoute?.url) {
      console.log('Duplicate Route Detected!', route.url);
      return;
    }
    if (this.topRoute?.path === route.path) {
      this.routeStack = [...this.routeStack.slice(0, this.routeStack.length - 1), route];
    } else {
      this.routeStack = [...this.routeStack, route];
    }
    this.routeStack$.next(this.routeStack);
  }

  private popSubRoute() {
    this.routeStack = this.routeStack.slice(0, this.routeStack.length - 1);
    this.routeStack$.next(this.routeStack);
  }


  openModal<T>(component: Type<T>, props?: ComponentProps<T>): Observable<HTMLIonModalElement> {
    // Close top modal based on navigation stack?
    const p = async () => {
      const modal = await this.controller.create({
        component: component as any,
        componentProps: {
          dismiss: () => this.pop(),
          props
        }
      });
      await modal.present();
      return modal;
    };
    return from(this.controller.getTop()).pipe(
      switchMap((prev) =>
        iif(
          () => !!prev?.dismiss,
          defer(() =>
            combineLatest([
              prev.dismiss(),
              prev.onDidDismiss()
            ])
          ),
          of(true)
        )
      ),
      tap(r => console.log('Dismiss', r)),
      tap(() => this.depth = START_DEPTH),
      switchMap(() => p()),
    );
  }
}
