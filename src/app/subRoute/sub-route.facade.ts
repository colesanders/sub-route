import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {clearSubRoute, subNavigate} from './sub-route.actions';

@Injectable()
export class SubRouteFacade {
  constructor(private store: Store) {
  }

  navigate(url: string) {
    this.store.dispatch(subNavigate({url}));
  }

  close(data: any, name = 'default') {
    this.store.dispatch(clearSubRoute({data, name}));
  }
}
