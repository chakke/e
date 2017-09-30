export class Vec2 {
    x: number = 0;
    y: number = 0;

    constructor(x?: number, y?: number) {
        if (x) this.x = x;
        if (y) this.y = y;
    }

    set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    setVec2(other: Vec2) {
        this.x = other.x;
        this.y = other.y;
    }
    scale(scale) {
        this.x *= scale;
        this.y *= scale;
    }

    add(x: number, y: number) {
        this.x += x;
        this.y += y;
    }
    sub(x: number, y: number) {
        this.x -= x;
        this.y -= y;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    length2() {
        return this.x * this.x + this.y * this.y;
    }
    isValid() {
        return this.x != 0 || this.y != 0;
    }
    public normalize() {
        if (this.isValid()) {
            let invLength: number = 1 / this.length();
            this.x *= invLength;
            this.y *= invLength;
        }
    }

    toString() {
        return "x: " + this.x + ", y : " + this.y;
    }

}