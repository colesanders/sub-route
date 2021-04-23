import {Observable, pipe, UnaryFunction} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import {SimpleRoute} from './subroute.model';

export const extractChildren = (): UnaryFunction<Observable<SimpleRoute>, Observable<SimpleRoute>> =>
  pipe(
    filter((route: SimpleRoute) => !!route && Array.isArray(route?.children)),
    filter(route => route.children.length > 0),
    tap(r => console.log('Extracting from route', r)),
    map(parent => ({
      url: parent.url,
      depth: parent.depth + 1,
      segmentCount: parent.segmentCount,
      ...parent.children[0]
    })),
  );
