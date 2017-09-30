import { Vec2 } from './vec2';
import { AppLoop } from '../app-loop';
import { GestureEvent } from './gesture-event';
import * as Hammer from 'hammerjs';
export class FabView {
    mElement: HTMLElement;

    mHammer: any;

    mPanStart: Vec2 = new Vec2(0, 0);

    mPosition = {
        current: new Vec2(0, 0),
        target: new Vec2(0, 0),
        animate: false,
        threshold: .08
    };


    mDirty: boolean = false;

    mEventListener: any;
    constructor() {

    }

    setEventListener(eventListener) {
        this.mEventListener = eventListener;
    }

    create(element: HTMLElement) {
        this.mElement = element;
        if (this.mElement) {
            this.mHammer = new Hammer(this.mElement);
            this.mHammer.get("pan").set({
                direction: Hammer.DIRECTION_ALL,
                enable: true
            });
            this.mHammer.get("tap").set({
                enable: true
            });
            this.mHammer.get("pinch").set({
                enable: true
            });

            this.mHammer.on("tap", event => {
                this.onTap(event);
            });
            this.mHammer.on("panstart", (event) => {
                this.onPanStart(event);
            });
            this.mHammer.on("pan", (event) => {
                this.onPan(event);
            });
            this.mHammer.on("panend", (event) => {
                this.onPanEnd(event);
            });
        }
        this.setTransform();
        AppLoop.getInstance().scheduleUpdate(this);
    }


    setTransform() {
        if (this.mElement) {
            this.mElement.style.transform = "translate3d(" + this.mPosition.current.x + "px," + this.mPosition.current.y + "px,0px)";
        }
    }

    onUpdate() {
        this.animatePosition();
        if (this.mDirty) {
            this.setTransform();
            this.mDirty = false;
        }
    }


    setPosition(x: number, y: number, force?: boolean) {
        this.mPosition.target.set(x, y);
        if (force) {
            this.mPosition.current.set(x, y);
            this.mPosition.animate = false;
        } else {
            this.mPosition.animate = true;
        }
        this.mDirty = true;
    }
    animatePosition() {
        if (this.mPosition.animate) {
            this.mPosition.current.x += this.mPosition.threshold * (this.mPosition.target.x - this.mPosition.current.x);
            this.mPosition.current.y += this.mPosition.threshold * (this.mPosition.target.y - this.mPosition.current.y);
            if (Math.abs(this.mPosition.target.x - this.mPosition.current.x) < .1 && Math.abs(this.mPosition.target.y - this.mPosition.current.y) < .05) {
                this.mPosition.current.x = this.mPosition.target.x;
                this.mPosition.current.y = this.mPosition.target.y;
                this.mPosition.animate = false;
            }
            this.mPanStart.x = this.mPosition.current.x;
            this.mPanStart.y = this.mPosition.current.y;
            this.mDirty = true;
        }
    }
    onTap(event) {
        if (this.mEventListener) this.mEventListener(GestureEvent.TAP, {});
    }
    onPanStart(event) {
        this.mPosition.animate = false;
        this.mPanStart.x = this.mPosition.current.x;
        this.mPanStart.y = this.mPosition.current.y;
        this.mPosition.current.x = this.mPanStart.x + event.deltaX;
        this.mPosition.current.y = this.mPanStart.y + event.deltaY;
        this.mDirty = true;
        if (this.mEventListener) this.mEventListener(GestureEvent.PAN_START, {});
    }

    onPan(event) {
        this.mPosition.current.x = this.mPanStart.x + event.deltaX;
        this.mPosition.current.y = this.mPanStart.y + event.deltaY;
        this.mDirty = true;
        if (this.mEventListener) this.mEventListener(GestureEvent.PAN, {});
    }


    onPanEnd(event) {
        this.mPosition.current.x = this.mPanStart.x + event.deltaX;
        this.mPosition.current.y = this.mPanStart.y + event.deltaY;
        this.mPanStart.x = this.mPosition.current.x;
        this.mPanStart.y = this.mPosition.current.y;
        this.mDirty = true;
        if (this.mEventListener) this.mEventListener(GestureEvent.PAN_END, {});
    }

}