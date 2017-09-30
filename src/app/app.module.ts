import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpService } from '../providers/http-service';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { BusinoModule } from '../providers/busino/busino';
import { HomePage } from '../pages/home/home';


import { GoogleMaps } from '@ionic-native/google-maps';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpService,
    BusinoModule
  ]
})
export class AppModule {}
