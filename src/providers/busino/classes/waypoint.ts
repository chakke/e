import { Vec2 } from "../../graphic-2d/vec2";
import { Polygon } from "../../graphic-2d/polygon";
import { Station } from './station';

export class WayPoint {
    polygon: Polygon = new Polygon();
    stations: Array<Station> = [];
    route_detail: string = "";
    constructor() {

    }

    reset() {

    }

    onResponse(data) { 
        if (!data) return;
        this.polygon.reset();
        this.polygon.onResponse(data.Geo);
        this.stations = [];
        for (let stationData of data.Station) {
            let station = new Station();
            station.onResponse(stationData);
            this.stations.push(station);
        }
        this.route_detail = data.route;
    }
}