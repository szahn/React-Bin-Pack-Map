"use strict";
import ISize = require("./ISize");

class Size implements ISize.ISize {
    private maxLength: number;
    constructor(private w: number, private h: number) {
        this.maxLength = Math.max(w, h);
    }

    width() {
        return this.w;
    }

    height() {
        return this.h;
    }

    greatestLength() {
        return this.maxLength;
    }

}

export = Size;