import {ComponentFactory, forwardRef, StaticProvider, Type} from '@angular/core';
import {Routes} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SUB_ROUTES, SubRouteService} from '../sub-route.service';
import {ActiveSubRoutes, HasChildTree, ParentComponent, RootTree, RouteTree, SimpleRoute} from '../subroute.model';

const resolveRootTree = (componentType: Type<any>) => (active$: ActiveSubRoutes): RootTree =>
  active$.pipe(
    map((active) => active.find(route => componentType === route.parent)),
  );

const resolveRouteTree = (parent$: Observable<SimpleRoute>, t?: HasChildTree) =>
  !!t?.childTree$ ? t.childTree$ : parent$;

export const provideRoutes = (routes: Routes) => ({
  provide: SUB_ROUTES,
  useValue: routes
});

export const provideRootTree = (component: ComponentFactory<any>) => ({
  provide: RootTree,
  useFactory: resolveRootTree(component.componentType),
  deps: [ActiveSubRoutes]
});

export const provideParent = (component: Type<any>, asParentType?: Type<any>) => ({
  provide: asParentType || ParentComponent,
  useExisting: forwardRef(() => component)
});

export const provideRouteTree = (dependsOnParent?: boolean, asParentType?: Type<any> & HasChildTree): StaticProvider => ({
  provide: RouteTree,
  useFactory: resolveRouteTree,
  deps: dependsOnParent ? [RootTree, asParentType || ParentComponent] : [RootTree]
});

export const provideActiveRoutes = () =>
  ({provide: ActiveSubRoutes, useFactory: (s) => s.routeStack$, deps: [SubRouteService]});
