import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RouteDetailPage } from './route-detail';

@NgModule({
  declarations: [
    RouteDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(RouteDetailPage),
  ],
})
export class RouteDetailPageModule {}
