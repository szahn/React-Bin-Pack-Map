import React = require('react');

interface IBinPackMapProps {
    rectangles: any[]
}

interface IRect{
    index: number;
    color: string;
}

class BinPackMap extends React.Component<IBinPackMapProps, any>{

    render() {
        const rects = this.props.rectangles.map((rect: any) => {            
            if (rect === null) return <g/>;
            const transform  = `translate(${rect.left()}, ${rect.top()})`;
            return (rect == null) ? <g/> :
                <g className="rect" transform={transform} key={rect.index() as number}>
                <rect x={0} y={0} style={{fill: rect.color}} width={rect.width() } height={rect.height() }></rect>
            </g>
        });

        return <g>{rects}</g>;
    }

}

export = BinPackMap;