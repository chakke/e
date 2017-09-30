
import { Vec2 } from '../../graphic-2d/vec2';
export class Station {
    location: Vec2 = new Vec2(0, 0);
    id: number = -1;
    code: string = "";
    fleetOver: string = "";
    routes: Array<string> = [];
    name: "";

    constructor() {
        this.reset();
    }
    reset() {
        this.location.set(0, 0);
        this.id = -1;
        this.code = "";
        this.fleetOver = "";
        this.routes = [];
        this.name = "";
    }

    onResponse(data) {
        this.location.set(data.Geo.Lat, data.Geo.Lng);
        this.id = data.ObjectID;
        this.code = data.Code;

        this.name = data.Name;
        this.fleetOver = data.FleetOver;

        let codes: string = data.FleetOver;
        let _codes = codes.split(",");
        for (let code of _codes) {
            this.routes.push(code);
        }
    }

    getID() {
        return this.id;
    }
}