import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import { SubRouteModule } from '../../../../libs/sub-routes/src';
import { SubRouteEffects } from '../../../../libs/sub-routes/src/lib/sub-route.effects';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {ModalChildOneComponent} from './modal-child-one/modal-child-one.component';
import {ModalChildTwoComponent} from './modal-child-two/modal-child-two.component';
import {ModalParentComponent} from './modal-parent/modal-parent.component';

@NgModule({
  declarations: [
    AppComponent,
    ModalParentComponent,
    ModalChildOneComponent,
    ModalChildTwoComponent
  ],
  entryComponents: [
    ModalParentComponent,
    ModalChildOneComponent,
    ModalChildTwoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    SubRouteModule.forRoot([
      {
        path: 'parent',
        component: ModalParentComponent,
        children: [
          {
            path: 'child-one',
            component: ModalChildOneComponent,
            children: [
              {
                path: 'depth-two',
                component: ModalChildTwoComponent
              }
            ]
          },
          {
            path: 'child-two',
            component: ModalChildTwoComponent
          }
        ]
      }
    ]),
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([SubRouteEffects]),
  ],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {
}
