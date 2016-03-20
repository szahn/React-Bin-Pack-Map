"use strict";
import React = require('react');
import Size = require('./geometry/Size');
import BinPackMap = require('./BinPackMap');
import SvgContainer = require('./components/SvgContainer');

class QuadrantGraph extends React.Component<any, any> {
    isPointerDown: boolean;
    pointerOrigin: number[];
    lastPos : number[];

    constructor() {
        super();
        this.state = {
            x: 0,
            y: 0,
            zoom: 1
        }
    }

    onDown(props: React.MouseEvent) {
        this.isPointerDown = true;
        this.pointerOrigin = [props.clientX, props.clientY];
        this.lastPos = [this.state.x, this.state.y];
    }

    onMove(props: React.MouseEvent) {
        if (!this.isPointerDown) { return; }
        this.setState({
            x: this.lastPos[0] + (this.pointerOrigin[0] - props.clientX),
            y: this.lastPos[1] + ( this.pointerOrigin[1] - props.clientY)
        });
    }

    onUp(props: React.MouseEvent) {
        this.isPointerDown = false;
    }

    onWheel(props: React.WheelEvent) {
        const zoom = Math.min(2, Math.max(.1, this.state.zoom + (props.deltaY / 1000)));   
        this.setState({
            zoom: zoom
        });
    }

    componentDidMount() {

    }

    render() {
        const x = this.state.x * (2 - this.state.zoom);
        const y = this.state.y * (2 - this.state.zoom);
        const vW = this.props.packMap.width * this.state.zoom;
        const vH = this.props.packMap.height * this.state.zoom;

        return (<SvgContainer
                onPointerDown={this.onDown.bind(this) }
                onPointerMove={this.onMove.bind(this) }
                onPointerUp={this.onUp.bind(this)}
                onPointerWheel={this.onWheel.bind(this) }
                x={x} y={y} viewWidth={vW} viewHeight={vH}
                width={this.props.size[0]} height={this.props.size[1]}>
                <BinPackMap rectangles={this.props.packMap.rectangles}></BinPackMap>
        </SvgContainer>);
    }
}

export = QuadrantGraph;