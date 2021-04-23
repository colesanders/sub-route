import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {forwardRef, ModuleWithProviders, NgModule} from '@angular/core';
import {Routes} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {SubRouteOutletDirective} from './outlet.directive';
import {provideModalController} from './providers/modal-controller.provider';
import {provideActiveRoutes, provideRoutes} from './providers/sub-route.providers';
import {SubRouteComponent} from './sub-route.component';
import {SubRouteFacade} from './sub-route.facade';
import {SubRouteService} from './sub-route.service';
import {SubNavigateDirective} from './subNavigate.directive';

@NgModule({
  declarations: [
    SubRouteComponent,
    SubRouteOutletDirective,
    SubNavigateDirective
  ],
  imports: [
    CommonModule,
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
  static routes;

  static forRoot(routes: Routes): ModuleWithProviders<SubRouteModule> {
    SubRouteModule.routes = routes;
    console.log(SubRouteModule.routes);
    return {
      ngModule: SubRouteModule,
      providers: [
        provideRoutes(SubRouteModule.routes),
        provideModalController(),
        SubRouteService,
        provideActiveRoutes(),
      ]
    };
  }

  static forChild(routes: Routes): ModuleWithProviders<SubRouteModule> {
    SubRouteModule.routes = [
      ...SubRouteModule.routes,
      ...routes
    ];
    console.log(SubRouteModule.routes);
    return {
      ngModule: SubRouteModule,
      providers: [
        provideRoutes(SubRouteModule.routes),
        // {provide: SubRouteService, useFactory: (service) => new SubRouteChildService(service), deps: [SubRouteService]}
        // { provide: SubRouteService, useExisting: forwardRef(() => SubRouteService) },
        // Need to break up service and create interface/abstract to create dependency inversion
        // and prevent circularity while providing.
        // Shouldn't have to worry in outside modules since they are provided ex post facto.
        provideModalController(),
        SubRouteService, // Reproviding service constructs it again.
        provideActiveRoutes()
      ]
    };
  }
}
