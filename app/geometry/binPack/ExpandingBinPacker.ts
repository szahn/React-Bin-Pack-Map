"use strict";
import Rectangle = require("../Rectangle");
import Size = require("../Size");
import PackedMap = require("./PackedMap");
import Node = require("./Node");
import Sides = require("../IntersectionSides");
/**
 * Arrange a set of 2D rectangles onto a graph.
 */
class ExpandingBinPacker
{
    private reservedRects = new Array<Rectangle>();
    private rightBoundary: number;

    /**
     * Instead of rejecting the rect on a collision, make an attempt to re-align it away from any intersecting rects.
     * @param rect
     */
    private tryRealignForCollisions(rect: Rectangle): Rectangle {
        if (rect === null) {return null;}
        for (let r of this.reservedRects) {
            const intersection = rect.getIntersectingSides(r);
            const intersectsLeft = (intersection & Sides.IntersectionSides.Left) === Sides.IntersectionSides.Left;
            const intersectsTop = (intersection & Sides.IntersectionSides.Top) === Sides.IntersectionSides.Top;
            const intersectsRight = (intersection & Sides.IntersectionSides.Right) === Sides.IntersectionSides.Right;
            const intersectsBottom = (intersection & Sides.IntersectionSides.Bottom) === Sides.IntersectionSides.Bottom;
            if (!((intersectsLeft || intersectsRight) && (intersectsTop || intersectsBottom))) { continue; }

            if (intersectsRight && (intersectsTop || intersectsBottom)) { return null; }

            if (intersectsLeft) {
                if (r.right() + rect.width() <= this.rightBoundary) {
                    rect.left(r.right());
                } else if (!intersectsTop) {
                    return null;
                }
            }

            if (intersectsTop) {
                rect.top(r.bottom() + 1);
            }

            return this.tryRealignForCollisions(rect);
        }

        return rect;
    }

    private orderByGreatestLengthDesc(sizes: Size[]): Size[] {
        return sizes.sort((a: Size, b: Size) => {
            if (a.greatestLength() === b.greatestLength()) {return 0;}
            return b.greatestLength() > a.greatestLength() ? 1 : -1;
        });
    }

    pack(sizes: any[], boundaryMultiplier: number): PackedMap {
        let mapWidth = 0;
        let mapHeight = 0;
        const orderedSizes = this.orderByGreatestLengthDesc(sizes);
        const first = new Size(orderedSizes[0].greatestLength(), orderedSizes[0].greatestLength());
        this.rightBoundary = first.width() * boundaryMultiplier;
        const root = new Node(new Rectangle(0, 0, this.rightBoundary, first.height()), 0, 0, 0);
        const packedRectangles = orderedSizes.map((size: Size, index: number) => {
            let node: Node, nodeRect: Rectangle;

            const needle = this.findNode(root, size);
            if (needle === null) {
                node = this.expandDown(root, size);
                nodeRect = node.rectangle();
            } else {
                nodeRect = needle.container;
                node = needle.owner;
            }

            this.splitNode(node.reserve(), size);
            const finalRect = <Rectangle>new Rectangle(nodeRect.left(), nodeRect.top(), size.width(), size.height()).index(index);
            this.reservedRects.push(finalRect);
            if (finalRect.right() > mapWidth) {mapWidth = finalRect.right();}
            if (finalRect.bottom() > mapHeight) {mapHeight = finalRect.bottom();}

            return finalRect;
        });        

        return {
            width: mapWidth,
            height: mapHeight,
            rectangles: packedRectangles
        };
    }

    private findNode(node: Node, size: Size): {owner: Node, container: Rectangle} {
        if (node === undefined || node === null || size === null) { return null; }

        if (node.isReserved()) {
            return this.findNode(node.rightOf(), size) || this.findNode(node.bottomOf(), size);
        }

        if (size.width() <= node.rectangle().width()
            && size.height() <= node.rectangle().height()) {

            const alignedRect = this.tryRealignForCollisions(
                new Rectangle(node.rectangle().left(), node.rectangle().top(), size.width(), size.height()));

            if (alignedRect !== null) {
                return {
                    owner: node,
                    container: alignedRect
                };
            }
        }

        return null;
    }

    private splitNode(node: Node, size: Size): void {
        const rect = node.rectangle();

        const rightRect = new Rectangle(rect.left() + size.width(), rect.top(), rect.width() - size.width(), rect.height());
        node.rightOf(new Node(rightRect, node.getDepth() + 1, node.columnNumber() + 1, node.rowNumber()));

        const bottomRect = new Rectangle(rect.left(), rect.top() + size.height(), rect.width(), rect.height() - size.height());
        node.bottomOf(new Node(bottomRect, node.getDepth() + 1, node.columnNumber(), node.rowNumber() + 1));
    }

    private getBottomMostNode(node: Node) {
        while (node) {
            const bottom = node.bottomOf();
            if (bottom === undefined || bottom === null && !node.isReserved()) {
                return node;
            }
            node = bottom;
        }       
    }

    private expandDown(node: Node, size: Size): Node {
        const bottom = this.getBottomMostNode(node);
        const bottomRect = new Rectangle(0, bottom.rectangle().top(), node.rectangle().width(), size.height());
        bottom.rectangle(bottomRect);
        return bottom;
    }
    
}

export = ExpandingBinPacker;