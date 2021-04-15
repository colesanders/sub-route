import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {SubRouteModule} from '../subRoute/sub-route.module';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SubRouteModule.forChild([
    ])
  ],
  declarations: [HomePage],
  exports: [HomePage]
})
export class HomePageModule {}
