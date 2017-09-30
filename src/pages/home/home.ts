import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BusinoModule } from '../../providers/busino/busino';
import { Route } from '../../providers/busino/classes/route';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mGoogleMap: any = null;

  mMapCenterPosition = { lat: 21.006716, lng: 105.843106 };

  mLoadingData: boolean = true;

  mRoutes: Array<Route> = [];

  constructor(public mAppModule: BusinoModule, public navCtrl: NavController) {

  }


  ionViewDidEnter() {
    this.mAppModule.loadConfig().then(() => {
      this.onLoadDataDone();
    });
  }
  onLoadDataDone() {
    this.mRoutes = [];
    this.mAppModule.getBusData().mRoutes.forEach(route => {
      this.mRoutes.push(route);
    });
    setTimeout(() => { this.mLoadingData = false; }, 500);
  }
  createMap() {
    if (this.mGoogleMap) return;

    this.mGoogleMap = new google.maps.Map(document.getElementById('my-map'), {
      zoom: 12,
      center: this.mMapCenterPosition
    });
    var marker = new google.maps.Marker({
      position: this.mMapCenterPosition,
      map: this.mGoogleMap
    });

  }

  onClickRoute(route: Route) {
    if (route.getCode() == "01") {
      this.navCtrl.push("RouteDetailPage", {
        route: route
      });
    } else {
      this.navCtrl.push("RouteDetailsPage", {
        route: route
      });
    }

  }
}
