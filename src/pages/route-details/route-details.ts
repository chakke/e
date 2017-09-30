import { Component, ViewChild } from '@angular/core';
import { Content, IonicPage, NavController, NavParams } from 'ionic-angular';

import { Route } from '../../providers/busino/classes/route';
import { WayPoint } from '../../providers/busino/classes/waypoint';
import { Station } from '../../providers/busino/classes/station';
import { BusRoute } from '../../providers/busino/controller/bus-controller';

import { BusinoModule } from '../../providers/busino/busino';
import { AppLoop } from '../../providers/app-loop';



import {
  GoogleMaps, GoogleMapsMapTypeId, GoogleMapsEvent,
  GoogleMap,
  LatLng, GoogleMapOptions,
  CameraPosition,
  Polyline, PolylineOptions,
  Circle, CircleOptions,
  Marker, MarkerOptions, MarkerIcon
} from '@ionic-native/google-maps';

declare var google;

@IonicPage()
@Component({
  selector: 'page-route-details',
  templateUrl: 'route-details.html',
})
export class RouteDetailsPage {
  @ViewChild(Content) mContent: Content;
  mGoogleMap: GoogleMap;

  mRoute: Route = new Route();
  mWaypoint: WayPoint = new WayPoint();
  mSelectedStationID: number = -1;
  mBusRoute: BusRoute;

  mReturnPolyline: any;
  mGoPolyline: any;
  mGoMarkers = [];
  mReturnMarkers = [];


  mMapCenterPosition = { lat: 21.006716, lng: 105.843106 };

  VIEW_CHIEU_DI: number = 1;
  VIEW_CHIEU_VE: number = 2;

  mViewType: number = 0;


  mMarkers: Array<any> = [];



  constructor(public mAppModule: BusinoModule, public navCtrl: NavController, public navParams: NavParams, private googleMaps: GoogleMaps) {
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
    this.onClickToggleView();

    AppLoop.getInstance().scheduleUpdate(this);

    this.createMap();


  }


  createMap() {


    if (this.mGoogleMap) return;

    let element: HTMLElement = document.getElementById('route-map');

    this.mGoogleMap = this.googleMaps.create(element);

    this.mGoogleMap.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        this.onGoogleMapReady();
      }
    );



  }

  onGoogleMapReady() {
    this.onGoogleMapReady();
    let mapOptions: GoogleMapOptions = {
      mapType: 'MAP_TYPE_NORMAL',
      controls: {
        compass: false,
        myLocationButton: false,
        indoorPicker: false
      },
      gestures: {
        scroll: true,
        tilt: false,
        zoom: true,
        rotate: false,
      },
      styles: [
        {
          featureType: "transit.station.bus",
          stylers: [
            {
              "visibility": "off"
            }
          ]
        }
      ],
      camera: {
        target: new LatLng(21.027764, 105.834160),
        zoom: 15,
        tilt: 0
      },
      preferences: {
        zoom: {
          minZoom: 10,
          maxZoom: 16
        },
        building: false,
      }
    }

    this.mGoogleMap.setOptions(mapOptions);


    for (let station of this.mRoute.mGoWaypoint.stations) {
      let stationMarker: MarkerOptions = {
        position: new LatLng(station.location.x, station.location.y),
        visible: true,
        title: station.name,
        icon: {
          url: 'assets/busstop.png',
          size: {
            width: 20,
            height: 40
          }
        }
      };
      this.mGoogleMap.addMarker(stationMarker);

    }




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

  }


  onClickStation(station: Station) {
    this.mSelectedStationID = station.getID();
    if (this.mGoogleMap) {
      this.mGoogleMap.moveCamera({
        target: new LatLng(station.location.x, station.location.y),
        zoom: 15
      });
    }
  }

  onUpdate() {


  }
}
