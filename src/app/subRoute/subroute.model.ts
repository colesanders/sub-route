import {Type} from '@angular/core';
import {Route} from '@angular/router';

export interface SubRoute {
  path: string;
  component: Type<any>;
  children?: SubRoute[];
}

export interface SimpleRoute {
  url: string;
  segmentCount: number;
  path: string;
  parent: Type<any>;
  children?: Route[];
}
