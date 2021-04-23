import {createAction, props} from '@ngrx/store';

export const subNavigate = createAction(
  '[SubNavigate] Sub Route Triggered',
  props<{ url: string, name?: string, props?: any }>()
);

export const subNavigationCompleted = createAction(
  '[SubNavigate] Sub Route Navigation Completed'
);

export const clearSubRoute = createAction(
  '[SubNavigate] Sub Route Cleared',
  props<{ data: any, name?: string }>()
);
