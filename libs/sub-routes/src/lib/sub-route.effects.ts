import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, tap} from 'rxjs/operators';
import {subNavigate, subNavigationCompleted} from './sub-route.actions';
import {SubRouteService} from './sub-route.service';

@Injectable()
export class SubRouteEffects {
  constructor(private store: Store, private actions$: Actions, private subRoute: SubRouteService) {
  }

  navListener$ = createEffect(() => this.actions$.pipe(
    ofType(subNavigate),
    tap(({url}) => this.subRoute.push(url)),
    map(() => subNavigationCompleted())
  ));

  modalStream$ = createEffect(() => this.subRoute.modalStream$.pipe(
    tap((r) => console.log(r))
  ), {dispatch: false});
}
