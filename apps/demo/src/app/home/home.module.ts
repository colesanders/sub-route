import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SubRouteModule } from '../../../../../libs/sub-routes/src';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SubRouteModule.forChild([
      {
        path: 'home',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage],
  exports: [HomePage]
})
export class HomePageModule {}
