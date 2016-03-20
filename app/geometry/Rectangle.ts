"use strict";
import Sides = require("./IntersectionSides");
class Rectangle {

    constructor(private x: number, private y: number, private w: number, private h: number) {
        
    }
    
    private idx: number;
    index(idx?: number): (number | Rectangle) {
        if (idx === undefined) {
            return this.idx;
        } else {
            this.idx = idx;
            return this;
        }
    }


    copy(): Rectangle {
        return new Rectangle(this.x, this.y, this.w, this.h);
    }

    left(newX?: number): number {
        if (newX !== undefined) {
            this.x = newX;
        }
        return this.x;
    }

    top(newY?: number): number {
        if (newY !== undefined) {
            this.y = newY;
        }
        return this.y;
    }

    width(): number {
        return this.w;
    }

    height(): number {
        return this.h;
    }

    right() : number {
        return this.x + this.w;
    }

    bottom() : number {
        return this.y + this.h;
    }

    getIntersectingSides(rect: Rectangle): Sides.IntersectionSides {
        let sides = 0;
        if (this.left() < rect.right() && this.left() >= rect.left()) {sides ^= Sides.IntersectionSides.Left };
        if (this.top() < rect.bottom() && this.top() >= rect.top()) { sides ^= Sides.IntersectionSides.Top };
        if (this.right() > rect.left() && this.right() <= rect.right()) { sides ^= Sides.IntersectionSides.Right };
        if (this.bottom() > rect.top() && this.bottom() <= rect.bottom()) { sides ^= Sides.IntersectionSides.Bottom };
        return sides;
    }
}

export = Rectangle;