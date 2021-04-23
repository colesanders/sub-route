import {Type} from '@angular/core';
import {Route} from '@angular/router';
import {Observable} from 'rxjs';

export interface SimpleRoute {
  url: string;
  depth: number;
  segmentCount: number;
  path: string;
  segments?: string[];
  parent?: Type<any>;
  component?: Type<any>;
  children?: SimpleRoute[];
}


export class RootTree extends Observable<SimpleRoute> {
}

export class RouteTree extends Observable<SimpleRoute> {
}

export class ActiveSubRoutes extends Observable<SimpleRoute[]> {
}

export interface HasChildTree {
  childTree$: Observable<SimpleRoute>;
}

export class ParentComponent implements HasChildTree {
  childTree$: RouteTree;
}
