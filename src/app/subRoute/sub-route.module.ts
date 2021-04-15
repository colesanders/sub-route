import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {Routes} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {EffectsModule} from '@ngrx/effects';
import {SubRouteOutletDirective} from './outlet.directive';
import {SubRouteComponent} from './sub-route.component';
import {SubRouteEffects} from './sub-route.effects';
import {SubRouteFacade} from './sub-route.facade';
import {CHILD_ROUTES, SUB_ROUTES, SubRouteService} from './sub-route.service';
import {SubNavigateDirective} from './subNavigate.directive';
import {SubRoute} from './subroute.model';

@NgModule({
  declarations: [
    SubRouteComponent,
    SubRouteOutletDirective,
    SubNavigateDirective
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([SubRouteEffects]),
    HttpClientModule,
    IonicModule,
  ],
  providers: [
    SubRouteFacade
  ],
  exports: [
    SubRouteComponent,
    SubNavigateDirective
  ]
})
export class SubRouteModule {
  static forRoot(routes: Routes): ModuleWithProviders<SubRouteModule> {
    return {
      ngModule: SubRouteModule,
      providers: [
        SubRouteService,
        {provide: SUB_ROUTES, useValue: routes},
      ]
    };
  }

  static forChild(routes: Routes): ModuleWithProviders<SubRouteModule> {
    return {
      ngModule: SubRouteModule,
      providers: [
        {provide: SUB_ROUTES, useValue: routes}
      ]
    };
  }
}
