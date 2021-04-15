import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {HomePage} from './home/home.page';
import {ModalChildOneComponent} from './modal-child-one/modal-child-one.component';
import {ModalChildTwoComponent} from './modal-child-two/modal-child-two.component';
import {ModalParentComponent} from './modal-parent/modal-parent.component';
import {SubRouteModule} from './subRoute/sub-route.module';

@NgModule({
  declarations: [AppComponent, ModalParentComponent, ModalChildOneComponent, ModalChildTwoComponent],
  entryComponents: [ModalParentComponent, ModalChildOneComponent, ModalChildTwoComponent],
  imports: [BrowserModule, IonicModule.forRoot(), EffectsModule.forRoot(), AppRoutingModule,
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
      },
      {
        path: 'home',
        component: HomePage
      }
    ]),
    StoreModule.forRoot({}, {})
  ],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {
}
