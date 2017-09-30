import { Component, ViewChild } from '@angular/core';
import { Content, IonicPage, NavController, NavParams } from 'ionic-angular';

import { Route } from '../../providers/busino/classes/route';
import { WayPoint } from '../../providers/busino/classes/waypoint';
import { Station } from '../../providers/busino/classes/station';
import { BusRoute } from '../../providers/busino/controller/bus-controller';

import { BusinoModule } from '../../providers/busino/busino';
import { AppLoop } from '../../providers/app-loop';


declare var google;

@IonicPage()
@Component({
  selector: 'page-route-detail',
  templateUrl: 'route-detail.html',
})
export class RouteDetailPage {
  @ViewChild(Content) mContent: Content;

  mRoute: Route = new Route();
  mWaypoint: WayPoint = new WayPoint();
  mSelectedStationID: number = -1;
  mBusRoute: BusRoute;

  mGoogleMap: any = null;
  mReturnPolyline: any;
  mGoPolyline: any;
  mGoMarkers = [];
  mReturnMarkers = [];


  mMapCenterPosition = { lat: 21.006716, lng: 105.843106 };

  VIEW_CHIEU_DI: number = 1;
  VIEW_CHIEU_VE: number = 2;

  mViewType: number = 0;


  mMarkers: Array<any> = [];



  constructor(public mAppModule: BusinoModule, public navCtrl: NavController, public navParams: NavParams) {
    if (this.navParams.get("route")) this.mRoute = this.navParams.get("route");
    if (this.mRoute.getCode().length == 0) {
      this.mAppModule.loadConfig().then(() => {
        this.onLoadDataDone();
      });
    }
  }
  loadRoute() {
    return new Promise((resolve, reject) => {
      if (this.mRoute && this.mRoute.getCode().length > 0) {
        resolve();
        return;
      }
      if (this.navParams.get("route")) {
        this.mRoute = this.navParams.get("route");
        resolve();
        return;
      }
      if (this.mRoute.getCode().length == 0) {
        this.mAppModule.loadConfig().then(() => {
          this.onLoadDataDone();
          resolve();
        });
      }

    });
  }
  getViewText() {
    if (this.mViewType == this.VIEW_CHIEU_DI) return "Chiều đi";
    if (this.mViewType == this.VIEW_CHIEU_VE) return "Chiều về";
    return "";
  }
  onLoadDataDone() {
    if (this.mRoute.getCode().length == 0) {
      this.mRoute = this.mAppModule.getBusData().getRouteByCode("32");
    }
  }

  ionViewWillEnter() {
    let mapDiv = document.getElementById("route-map");
    let contentDiv = document.getElementById("route-info");
    contentDiv.style.height = (this.mContent.getContentDimensions().contentHeight - mapDiv.clientHeight) + "px";

  }

  ionViewDidEnter() {
    this.loadRoute().then(() => {
      this.onLoadedRoute();
    });

  }
  ionViewWillLeave() {
    AppLoop.getInstance().unScheduleUpdate(this);
  
  }
  onLoadedRoute() {
    this.createMap();
    AppLoop.getInstance().scheduleUpdate(this);
  }


  createMap() {
    if (this.mGoogleMap) return;

    this.mGoogleMap = new google.maps.Map(document.getElementById('route-map'), {
      zoom: 12,
      center: this.mMapCenterPosition
    });

    {
      let points = [];
      for (let point of this.mRoute.mGoWaypoint.polygon.mPoints) {
        points.push({
          lat: point.x,
          lng: point.y
        });
      }
      this.mGoPolyline = new google.maps.Polyline({
        path: points,
        geodesic: true,
        strokeColor: '#26A65B',
        strokeOpacity: 1.0,
        strokeWeight: 4
      });
    }

    {
      let points = [];
      for (let point of this.mRoute.mReturnWaypoint.polygon.mPoints) {
        points.push({
          lat: point.x,
          lng: point.y
        });
      }
      this.mReturnPolyline = new google.maps.Polyline({
        path: points,
        geodesic: true,
        strokeColor: '#EF4836',
        strokeOpacity: 1.0,
        strokeWeight: 4
      });
    }

    {
      this.mGoMarkers = [];
      for (let station of this.mRoute.mGoWaypoint.stations) {
        let marker = new google.maps.Marker({
          position: { lat: station.location.x, lng: station.location.y },
          map: this.mGoogleMap,
          title: station.name,
          icon: "assets/busstop.png"
        });
        this.mGoMarkers.push(marker);
      }
    }
    {
      this.mReturnMarkers = [];
      for (let station of this.mRoute.mReturnWaypoint.stations) {
        let marker = new google.maps.Marker({
          position: { lat: station.location.x, lng: station.location.y },
          map: this.mGoogleMap,
          title: station.name,
          icon: "assets/busstop.png"
        });
        this.mReturnMarkers.push(marker);
      }
    }

    this.onClickToggleView();

  }

  onClickToggleView() {
    this.mViewType++;
    if (this.mViewType > 2) this.mViewType = 1;

    if (this.mViewType == this.VIEW_CHIEU_DI) {
      this.mWaypoint = this.mRoute.mGoWaypoint;
    }
    else if (this.mViewType == this.VIEW_CHIEU_VE) {
      this.mWaypoint = this.mRoute.mReturnWaypoint;
    }

    this.drawPolygon();
    this.drawMarkers();

    if (this.mViewType == this.VIEW_CHIEU_DI) {
      this.onClickStation(this.mRoute.mGoWaypoint.stations[0]);
    }
    else if (this.mViewType == this.VIEW_CHIEU_VE) {
      this.onClickStation(this.mRoute.mReturnWaypoint.stations[0]);
    }
    if (this.mBusRoute) this.mBusRoute.setViewType(this.mViewType);
  }
  drawMarkers() {
    if (this.mViewType == this.VIEW_CHIEU_DI) {
      for (let marker of this.mGoMarkers) {
        marker.setMap(this.mGoogleMap);
      }
      for (let marker of this.mReturnMarkers) {
        marker.setMap(null);
      }

    } else if (this.mViewType == this.VIEW_CHIEU_VE) {
      for (let marker of this.mGoMarkers) {
        marker.setMap(null);
      }
      for (let marker of this.mReturnMarkers) {
        marker.setMap(this.mGoogleMap);
      }
    }



  }

  drawPolygon() {

    if (this.mViewType == this.VIEW_CHIEU_DI) {
      this.mGoPolyline.setMap(this.mGoogleMap);
      this.mReturnPolyline.setMap(null);
    } else if (this.mViewType == this.VIEW_CHIEU_VE) {
      this.mReturnPolyline.setMap(this.mGoogleMap);
      this.mGoPolyline.setMap(null);
    }

  }

  onClickStation(station: Station) {
    this.mSelectedStationID = station.getID();
    this.mGoogleMap.panTo({ lat: station.location.x, lng: station.location.y });
    this.mGoogleMap.setZoom(14);
  }

  onUpdate() {


  }
}
