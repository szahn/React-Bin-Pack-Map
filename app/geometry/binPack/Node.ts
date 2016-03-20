"use strict";
import Rectangle = require("../Rectangle");

class Node {
    constructor(private rect: Rectangle, private depth: number, private column: number, private row: number) {
        this.reserved = false;
    }

    rectangle(r?: Rectangle): Rectangle {
        if (r === undefined) {
            return this.rect;
        } else {
            this.rect = r;
            return this.rect;
        }
    }

    getDepth() {
        return this.depth;
    }

    columnNumber() {
        return this.column;
    }

    rowNumber() {
        return this.row;
    }

    private right: Node;
    rightOf(node?: Node): Node {
        if (node === undefined) {
            return this.right;
        } else {
            this.right = node;
            return this.right;
        }
    }

    private bottom: Node;
    bottomOf(node?: Node): Node {
        if (node === undefined) {
            return this.bottom;
        } else {
            this.bottom = node;
            return this.bottom;
        }
    }

    private reserved: boolean;
    isReserved(): boolean {
        return this.reserved;
    }

    reserve(): Node {
        this.reserved = true;
        return this;
    }
}

export = Node;