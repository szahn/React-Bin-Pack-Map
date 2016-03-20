"use strict";
import React = require('react');
import SvgContainer = require('./components/SvgContainer');
import ExpandingBinPacker = require('./geometry/binPack/ExpandingBinPacker');
import Size = require('./geometry/Size');
import QuadrantGraph = require('./QuadrantGraph');
import $ = require("jquery");
import IDimensionalItem = require("./IDimensionalItem")

interface QuadGraphContainerProps {
    size: number[]
}

interface QuadGraphContainerState{
    items ?: IDimensionalItem[],
    packMap ?: {width: number, height: number, rectangles: any[]}
    
}

class QuadGraphContainer extends React.Component<QuadGraphContainerProps, QuadGraphContainerState> {
    constructor() {
        super();
        this.state = {
            items: [],
            packMap: {
                width: 0,
                height: 0,
                rectangles: []
            }
        }
    }

    buildMap(rects: any[]) {
        const startTime = performance.now();
        const map = new ExpandingBinPacker().pack(rects, 6);
        map.rectangles = map.rectangles.map((rect : any, idx) => {
            rect.color = rects[idx].color;
            return rect;
        });

        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(`Map size is ${map.width}x${map.height} took ${duration}ms with ${rects.length} rects.`);
        return map;
    }

    componentDidMount() {        
        $.getJSON("rects.json", (rects)=> {            
            this.setState({
                packMap: this.buildMap(rects.items.map((rect : any[]) => {
                    const sizedItem : any  = new Size(rect[1] as number, rect[2] as number);
                    sizedItem.color = rect[0];
                    return sizedItem;
                }))
            });
        });       
    }

    render() {
        return (<QuadrantGraph packMap={this.state.packMap} size={this.props.size}/>)
    }

}

export = QuadGraphContainer;