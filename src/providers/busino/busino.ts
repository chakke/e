
import { Injectable } from '@angular/core';
import { HttpService } from "../http-service";
import { BusinoHttpService } from "./busino-http-service";
import { BusinoConfig } from "./busino-config";
import { BusinoData } from './controller/busino-data';

import { AppLoop } from '../app-loop';
@Injectable()
export class BusinoModule {

    private mBusinoHttpService: BusinoHttpService;

    private mConfig: BusinoConfig;

    private mBusData: BusinoData;

    constructor(private mHttpService: HttpService) {

        this.mBusinoHttpService = new BusinoHttpService(mHttpService);

        this.mConfig = new BusinoConfig();

        this.mBusData = new BusinoData();

        AppLoop.getInstance().scheduleUpdate(this);
    }

    /**===================Get Functions=================== */
    getHttpService() {
        return this.mBusinoHttpService;
    }
    getAppConfig() {
        return this.mConfig;
    }
    
    loadConfig() {

        return new Promise((resolve, reject) => {
            if (this.mBusData.mRoutes.size > 0) {
                resolve();
                return;
            } else {
                this.mHttpService.getHttp().request("assets/config/busino.json").subscribe(
                    data => {
                        this.onLoadedConfig(data.json());
                        this.mHttpService.getHttp().request("assets/config/busdata.json").subscribe(
                            data => {
                                this.onLoadedBusData(data.json())
                                resolve();
                            }
                        );
                    }
                );
            }
        });
    }

    getBusData() {
        return this.mBusData;
    }
    onLoadedBusData(data) {
        this.mBusData.onResponse(data.routes);
    }
    onLoadedConfig(data) {
        this.mConfig.onResponseConfig(data);
        this.getHttpService().onLoadedConfig(data.connection_config);
    }
    onUpdate() {
      
    }
    /**============================================== */

}


