import { Vec2 } from '../../graphic-2d/vec2';
import { WayPoint } from './waypoint';
import { Utils } from '../../app-utils';
export class Bus {
    mCode: string;
    mRouteCode: string;
    mWayType: number = 1;
    mCurrentLocation: Vec2 = new Vec2(0, 0);
    mTarget: Vec2 = new Vec2(0, 0);
    mVelocity: Vec2 = new Vec2(0, 0);
    mStationIndex: number = 1;
    mMoveDone: boolean = false;
    mMarker: any;
    mNextMarker: any;

    mSpeed: number = 0.0001;
    mSpeeds = [0.0001, 0.0003, 0.0001, 0.0004, 0.00014, 0.0002, 0.00025];
    mSpeedTime: number = 0;
    mSpeedStep: number = 5000;



    constructor() {


    }


    onUpdate() {
        this.move();
        this.updateMarker();
        this.updateSpeed();
    }
    updateSpeed() {
        if (this.mSpeedTime < this.mSpeedStep) return;
        this.mSpeedTime++;
        this.mSpeed = this.mSpeeds[Utils.randInt(0, this.mSpeeds.length - 1)];
    }
    setLocation(vec2: Vec2) {
        this.mCurrentLocation.setVec2(vec2);
    }
    setTarget(target: Vec2) {
        this.mTarget.setVec2(target);
    }
    setStationIndex(index: number) {
        this.mStationIndex = index;
    }

    private move() {
        this.mVelocity.set(this.mTarget.x - this.mCurrentLocation.x, this.mTarget.y - this.mCurrentLocation.y);

        if (this.mVelocity.length2() < this.mSpeed * this.mSpeed) {
            this.mMoveDone = true;
            this.mCurrentLocation.setVec2(this.mTarget);
            this.mVelocity.set(0, 0);
        } else {
            this.mMoveDone = false;
            this.mVelocity.normalize();
            this.mVelocity.scale(this.mSpeed);
            this.mCurrentLocation.add(this.mVelocity.x, this.mVelocity.y);
            this.mVelocity.set(0, 0);
        }
    }
    setMarkerVisible(visible: boolean) {
        if (this.mMarker) this.mMarker.setVisible(visible);
    }
    updateMarker() {
        if (this.mMarker) {
            this.mMarker.setPosition({
                lat: this.mCurrentLocation.x,
                lng: this.mCurrentLocation.y
            });
            // let rotation = this.calculateRotateDegree(this.mCurrentLocation.x, this.mCurrentLocation.y, this.mTarget.x, this.mTarget.y);
            // this.mMarker.set
        }

        if (this.mNextMarker) {
            this.mNextMarker.setPosition({
                lat: this.mTarget.x,
                lng: this.mTarget.y
            });
        }
    }
    calculateRotateDegree(lat1: number, lng1: number, lat2: number, lng2: number): number {
        if ((lat2 - lat1 >= 0) && (lng2 - lng1 >= 0))
            return this.radianToDegree(Math.asin((lng2 - lng1) / Math.sqrt(Math.pow((lat2 - lat1), 2) + Math.pow((lng2 - lng1), 2))));
        else if ((lng2 - lng1 >= 0) && (lat2 - lat1 <= 0)) {
            return 180 - this.radianToDegree(Math.asin((lng2 - lng1) / Math.sqrt(Math.pow((lat2 - lat1), 2) + Math.pow((lng2 - lng1), 2))));
        }
        else if ((lat2 - lat1 <= 0) && (lng2 - lng1 <= 0)) {
            return 180 + this.radianToDegree(Math.asin((lng1 - lng2) / Math.sqrt(Math.pow((lat2 - lat1), 2) + Math.pow((lng2 - lng1), 2))));
        }
        else if ((lng2 - lng1 <= 0) && (lat2 - lat1 >= 0)) {
            return 360 - this.radianToDegree(Math.asin((lng1 - lng2) / Math.sqrt(Math.pow((lat2 - lat1), 2) + Math.pow((lng2 - lng1), 2))));
        }
        return 0;
    }
    public radianToDegree(value) {
        return value * 180 / Math.PI;
    }
    hasMoveDone() {
        return this.mMoveDone;
    }
}