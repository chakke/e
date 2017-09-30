import { Vec2 } from "./vec2";


export class Polygon {
    
    mPoints: Array<Vec2> = [];

    constructor() {

    }

    reset() {
        this.mPoints = [];
    }

    onResponse(data) {
        this.reset();
        for (let pointData of data) {
            let point = new Vec2(pointData.Lat, pointData.Lng);
            this.mPoints.push(point);
        }
    }
}