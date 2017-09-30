
import { Vec2 } from './vec2';
import { Size } from './size';
export class Rectangle {
    position: Vec2 = new Vec2(0, 0);
    size: Size = new Size();
    constructor() {

    }
    set(x: number, y: number, width: number, height: number) {
        this.position.set(x, y);
        this.size.set(width, height);
    }

    setPosition(x: number, y: number) {
        this.position.set(x, y);
    }

    setSize(width: number, height: number) {
        this.size.set(width, height);
    }

    setRect(rect: ClientRect) {
        this.position.set(rect.left, rect.top);
        this.size.set(rect.width, rect.height);
    }

    getCenterPosition() {
        return new Vec2(this.position.x + this.size.width / 2, this.position.y + this.size.height / 2);
    }

    getCenterX() {
        return this.position.x + this.size.width / 2;
    }
    getCenterY() {
        return this.position.y + this.size.height / 2;
    }
}
