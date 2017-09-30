import { Vec2 } from './vec2';
import { Size } from './size';
import { Rectangle } from './rectangle';
import { AppLoop } from '../app-loop';
import { GestureEvent } from './gesture-event';
import { Utils } from '../app-utils';
import * as Hammer from 'hammerjs';
export class FabButton {
    mElement: HTMLElement;
    mContent: HTMLElement;
    mHammer: any;
    mPanStart: Vec2 = new Vec2(0, 0);
    mPosition = {
        current: new Vec2(0, 0),
        target: new Vec2(0, 0),
        animate: false,
        threshold: .08
    };
    mElementSize: Size = new Size();
    mBound: Rectangle = new Rectangle();
    mPadding: number = 10;
    mZoom = {
        current: 1,
        target: 1,
        threshold: 0.2,
        animate: false
    };

    mShowContent: boolean = false;

    mDirty: boolean = false;

    mEventListener: any;
    constructor() {
        this.mBound.set(0, 0, 1000, 1000);
    }
    setBoundSize(width: number, height: number) {
        this.mBound.setSize(width, height);
        this.checkOutOfBox();
    }

    setRelativeContent(id: string) {
        this.mContent = document.getElementById(id);
    }

    setEventListener(eventListener) {
        this.mEventListener = eventListener;
    }

    create(element: HTMLElement) {
        this.mElement = element;
        if (this.mElement) {
            this.mElementSize.set(this.mElement.clientWidth, this.mElement.clientHeight);
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
            this.mElement.style.transform = "translate3d(" + this.mPosition.current.x + "px," + this.mPosition.current.y + "px,0px) " + "scale(" + this.mZoom.current + ")";
        }
        if (this.mContent) {
            if (this.mShowContent) {
                this.mContent.style.transform = "translate3d(" + this.mPosition.current.x + "px," + (this.mPosition.current.y + this.mElementSize.height) + "px,0px)";
            }
        }
    }

    onUpdate() {
        this.animatePosition();
        this.animateZoom();
        if (this.mDirty) {
            this.setTransform();
            this.mDirty = false;
        }

    }

    animateZoom() {
        if (this.mZoom.animate) {
            this.mZoom.current += this.mZoom.threshold * (this.mZoom.target - this.mZoom.current);
            if (Math.abs(this.mZoom.target - this.mZoom.current) < .01) {
                this.mZoom.current = this.mZoom.target;
                this.mZoom.animate = false;
            }
            this.mDirty = true;
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
    private bubbleView() {
        let topZindex = Utils.getTopZIndex();
        this.mElement.style.zIndex = "" + topZindex;
        if (this.mContent) this.mContent.style.zIndex = "" + topZindex;
    }
    onTap(event) {

        this.mZoom.animate = true;
        this.mZoom.current = .9;
        this.mZoom.target = 1;
        this.doToggleContent();
        this.bubbleView();
        if (this.mEventListener) this.mEventListener(GestureEvent.TAP, {});

    }
    doToggleContent() {
        this.mShowContent = !this.mShowContent;
        if (this.mContent) {
            this.mContent.style.display = this.mShowContent ? "block" : "none";
        }
    }
    onPanStart(event) {
        this.mZoom.animate = true;
        this.mZoom.target = 0.8;
        this.mPosition.animate = false;
        this.mPanStart.x = this.mPosition.current.x;
        this.mPanStart.y = this.mPosition.current.y;
        this.mPosition.current.x = this.mPanStart.x + event.deltaX;
        this.mPosition.current.y = this.mPanStart.y + event.deltaY;
        this.mDirty = true;
        this.bubbleView();
        if (this.mEventListener) this.mEventListener(GestureEvent.PAN_START, {});
    }

    onPan(event) {
        this.mPosition.current.x = this.mPanStart.x + event.deltaX;
        this.mPosition.current.y = this.mPanStart.y + event.deltaY;
        this.mDirty = true;
        if (this.mEventListener) this.mEventListener(GestureEvent.PAN, {});
    }
    checkOutOfBox() {
        this.mPosition.target.set(this.mPosition.current.x, this.mPosition.current.y);
        if (this.mPosition.current.x < this.mPadding) {
            this.mPosition.target.x = this.mPadding;
            this.mPosition.animate = true;
        }
        if (this.mPosition.current.x > this.mBound.size.width - this.mElementSize.width - this.mPadding) {
            this.mPosition.target.x = this.mBound.size.width - this.mElementSize.width - this.mPadding;
            this.mPosition.animate = true;
        }
        if (this.mPosition.current.y < this.mPadding) {
            this.mPosition.target.y = this.mPadding;
            this.mPosition.animate = true;
        }
        if (this.mPosition.current.y > this.mBound.size.height - this.mElementSize.height - this.mPadding) {
            this.mPosition.target.y = this.mBound.size.height - this.mElementSize.height - this.mPadding;
            this.mPosition.animate = true;
        }
    }

    onPanEnd(event) {
        this.mZoom.animate = true;
        this.mZoom.target = 1;
        this.mPosition.current.x = this.mPanStart.x + event.deltaX;
        this.mPosition.current.y = this.mPanStart.y + event.deltaY;
        this.mPanStart.x = this.mPosition.current.x;
        this.mPanStart.y = this.mPosition.current.y;
        this.checkOutOfBox();
        this.mDirty = true;
        if (this.mEventListener) this.mEventListener(GestureEvent.PAN_END, {});
    }

}