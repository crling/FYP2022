import Oviz from "crux";
import { Color } from "crux/dist/color";
import { Component, ComponentOption } from "crux/dist/element";
import * as d3 from "d3";

export enum Gravity {
    Top = 0, Right, Bottom, Left,
}

interface DiagramLink {
    source: string;
    target: string;
    correlation: number;
    source_x?: number;
    source_y?: number;
    target_x?: number;
    target_y?: number;
    _strokeWidth?: number;
}

export interface NetworkDiagramOption<Data extends T[], T= any> extends ComponentOption {
    _gravity?: Gravity;
    // the gravity or direction of the graph
    _raidus?: number | ((d: T, i: number) => number);
    // the radius of each dot
    _maxX?: number;
    // the maxv alue of x that users provide
    _minX?: number;
    // the min value of x that users provide
    _maxY?: number;
    // the maxv alue of y that users provide
    _minY?: number;
    // The value of the y-coordinate (belongs to the vertical axis)
    _yFunc?: (d: T, i?: number) => number;
    // The value of the x-coordinate (belongs to the horizontal axis)
    _xFunc?: (d: T, i?: number) => number;
    // The class of circles
    _classFunc?: (d: T, i?: number) => string;
    // Whether to display labels of circles
    _labelFunc?: (d: T, i?: number) => string;
    _links?: DiagramLink[]  ;
    _nodes?: any[] ;
    _phylums?: any;
    colorMap: any;
    showNodeNames: boolean;
}

export class NetworkDiagram extends Component<NetworkDiagramOption<any[], any>> {

    protected edgeColor: {group1:string, group2:string };

    protected _nodes: any[];
    protected _links: DiagramLink[];
    protected _updateNode: {nid, newX, newY};
    protected _scaleX;
    protected _scaleY;
    protected _edgeScale;
    // the nodes groups are hardcoded as
    // group 1: Control enrichment
    // group 2: Gout enrichment
    protected group1LinkedX = 0;
    protected group2LinkedX = 700;
    protected group1LinkedY = 100;
    protected group2LinkedY = 100;
    protected group1LinkedRow = 0;
    protected group1LinkedCol = 0;
    protected group2LinkedRow = 0;
    protected group2LinkedCol = 0;
    protected group1LinkedColumnCount = 0;
    protected group2LinkedColumnCount = 0;
    protected group1NonLinkX = 0;
    protected group2NonLinkX = 700;
    protected group1NonLinkY = 600;
    protected group2NonLinkY = 600;
    protected group1NonLinkColumnCount = 0;
    protected group2NonLinkColumnCount = 0;
    protected layoutConfig = {
        nodeInterval: 70,
        groupWidth: 600,
        offset: 20,
        maxCol: 8,
    };

    render() {
        return this.t`Component{
            width = 1500; height = 800; id = "network"
            Line {
                x1 = layoutConfig.groupWidth; x2 = layoutConfig.groupWidth; y1 = 0; y2 = 700
                strokeWidth = 2
                stroke = "grey"
                dashArray = "4 2"
            }
            Text.centered {
                text = "Control Enrichment"
                x = layoutConfig.groupWidth/2; y = 20
                fontSize = 20
                style:user-select = "none"
            }
            Text.centered {
                text = "Gout Enrichment"
                x = layoutConfig.groupWidth * 1.5; y = 20
                fontSize = 20
                style:user-select = "none"
            }
            @for (l, i) in _links {
                Line {
                    key = i;
                    x1 = l.source_x; x2 = l.target_x; y1 = l.source_y; y2 = l.target_y
                    strokeWidth = l.correlation < 0.5 ? 0.5 : _edgeScale(l.correlation)
                    stroke = l.correlation < 0.5 ? edgeColor.group1 : edgeColor.group2
                    behavior:tooltip {
                        content = [edgeDetail, l]
                    }
                }
            }
            @for d in _nodes {
                Component {
                    id = d.NodeName
                    x = d._x
                    y = d._y
                    on:mousedown = (ev, el) => dragStart(ev, el, d.NodeGroup)
                    on:mouseup = (ev, el) => dragEnd(ev, el)
                    
                    behavior:tooltip {
                        content = [nodeDetail, d]
                    }
                    
                    Circle.centered{
                        r =  Math.sqrt(d.NodeSize) * 3.14
                        fill = getFillByPhylumAndGenus(d)
                    }
                    @if prop.showNodeNames {
                        Text.centered {
                            html = parseText(d.NodeName)
                            fill = "black"
                            style:font-weight = "bold"
                            style:user-select = "none"
                        }
                    }
                }
            }
        }`;
    }

    parseText(str: string): string {
        if (str.length > 10 ) {
            const strs = str.split(" ");
            let parsedStr: string = "";
            strs.forEach( (s, i) => {
                parsedStr = parsedStr.concat(`<tspan x = ${s.length / 4 * -1}em dy = ${i}em>${s}</tspan>`);
            });
            return parsedStr;
        }
        return str;
    }

    nodeDetail(d) {
        let details = `Node ID: ${d.id}<br>Size: ${d.size}`;
        details += `<br>Phylum: ${d.NodePhylum}<br>Genus: ${d.NodeGenus}`;
        return details;
    }
    edgeDetail(l) {
        let details = `Source ID: ${l.source}<br>Target ID: ${l.target}`;
        details += `<br>Correlation: ${parseFloat(l.correlation).toFixed(3)}`;
        return details;
    }

    protected dragEnd(_, el) {
        delete this.$on['mousemove'];
        el.stage = null;
        this._updateNode = null;
        // this.setState(null);
    }

    protected dragStart(_, el, group) {
        this.$on['mousemove'] = (evp, elp) => {
            let [newX, newY] = Oviz.utils.mouse(elp, evp);
            console.log(`${newX} - ${newY}`)
            if (newY < 50 || newY > 700) {
                el.stage = null;
                return;
            }
            if (group === "Control") {
                if (newX < 0 || newX > this.layoutConfig.groupWidth) {
                    el.stage = null;
                    return;
                }
            } else {
                if (newX < this.layoutConfig.groupWidth || newX > this.layoutConfig.groupWidth * 2 + 100) {
                    el.stage = null;
                    return;
                }
            }
            this._updateNode = {nid: el._prop.id, newX, newY};
            this.setState({
                ...this._updateNode,
            });
        }
        el.stage = "dragging";
    }
    didCreate() {
        this.edgeColor = {
            group1: Color.literal("red").desaturate(30).string,
            group2: Color.literal("blue").desaturate(30).lighten(20).string,
        }
        this._nodes = this.prop._nodes.map(d => {
            const temp_x = this.setUpXCoordinates(d);
            const temp_y = this.setUpYCoordinates(d);
            this.prop._links.forEach(e => {
                if (d.NodeName === e.source) {
                    e.source_x = temp_x;
                    e.source_y = temp_y;
                }
                if (d.NodeName === e.target) {
                    e.target_x = temp_x;
                    e.target_y = temp_y;
                }
            });
            d._x = temp_x;
            d._y = temp_y;
            return d;
        });
        let maxCor = 0;
        this.prop._links.forEach(d => {
            if (maxCor < d.correlation) maxCor = d.correlation;
        });
        this._links = this.prop._links;
        this._edgeScale = d3.scaleQuantize()
                            .domain([0.5, maxCor])
                            .range([1, 1.5, 2]);
    }

    willRender() {
        if (this._updateNode) {
            this._nodes.forEach( node => {
                if (node.NodeName === this._updateNode.nid) {
                    node._x = this._updateNode.newX;
                    node._y = this._updateNode.newY;
                }
            });
            this._links.forEach( link => {
                if ( link.source === this._updateNode.nid) {
                    link.source_x = this._updateNode.newX;
                    link.source_y = this._updateNode.newY;
                } else if ( link.target === this._updateNode.nid) {
                    link.target_x = this._updateNode.newX;
                    link.target_y = this._updateNode.newY;
                }
            });
        }
    }

    protected getParsedNodes() {
        return this.prop._nodes.map(d => {
            const temp_x = this.setUpXCoordinates(d);
            const temp_y = this.setUpYCoordinates(d);
            this.prop._links.forEach(e => {
                if (d.id === e.source) {
                    e.source_x = temp_x;
                    e.source_y = temp_y;
                }
                if (d.id === e.target) {
                    e.target_x = temp_x;
                    e.target_y = temp_y;
                }
            });
            d._x = temp_x;
            d._y = temp_y;
            return d;
        });
    }

    protected getFillByPhylumAndGenus(d) {
        if (d.NodeName.startsWith(d.NodeGroup)) return this.prop.colorMap.Other.Unclassified;
        return this.prop.colorMap[d.NodePhylum][d.NodeGenus];
    }

    protected setUpXCoordinates(d) {
        let returnX = 0;
        let flag_link = false;
        this.prop._links.forEach((e, i) => {
            if (e.source === d.NodeName || e.target === d.NodeName) {
                flag_link = true;
            }
        });
        if (d.NodeGroup === "Control") {
            if (flag_link) {
                returnX = this.group1LinkedX;
                this.group1LinkedX += this.layoutConfig.nodeInterval;
            } else {
                returnX = this.group1NonLinkX;
                this.group1NonLinkX += this.layoutConfig.nodeInterval;
            }
        } else if (d.NodeGroup === "Gout") {
            if (flag_link) {
                returnX = this.group2LinkedX;
                this.group2LinkedX += this.layoutConfig.nodeInterval;
            } else {
                returnX = this.group2NonLinkX;
                this.group2NonLinkX += this.layoutConfig.nodeInterval;
            }
        }
        return returnX;
    }

    protected setUpYCoordinates(d) {
        let returnY = 0;
        let flag_link = false;
        this.prop._links.forEach(e => {
            if (e.source === d.NodeName || e.target === d.NodeName) {
                flag_link = true;
            }
        });
        // Group 1 Y
        if (d.NodeGroup === "Control") {
            if (flag_link) {
                returnY = this.group1LinkedCol % 2 === 1 ? this.group1LinkedY + this.layoutConfig.offset
                    : this.group1LinkedY;
                // this.group1LinkedColumnCount ++;
                this.group1LinkedCol ++;
                if (this.group1LinkedCol === this.layoutConfig.maxCol) {
                    this.group1LinkedCol = 0;
                    this.group1LinkedRow ++;
                    this.group1LinkedX = this.group1LinkedRow % 2 === 1 ? this.layoutConfig.offset : 0;
                    this.group1LinkedY += this.layoutConfig.nodeInterval;
                    this.group1LinkedColumnCount = 0;
                }
            } else {
                returnY = this.group1NonLinkY;
                this.group1NonLinkColumnCount ++;
                if (this.group1NonLinkColumnCount === this.layoutConfig.maxCol) {
                    this.group1NonLinkX = 0;
                    this.group1NonLinkY += this.layoutConfig.nodeInterval;
                    this.group1NonLinkColumnCount = 0;
                }
            }
        } else if (d.NodeGroup === "Gout") {
            if (flag_link) {
                returnY = this.group2LinkedCol % 2 === 1 ? this.group2LinkedY + this.layoutConfig.offset
                    : this.group2LinkedY;
                this.group2LinkedCol ++;
                if (this.group2LinkedCol === this.layoutConfig.maxCol) {
                    this.group2LinkedCol = 0;
                    this.group2LinkedRow ++;
                    this.group2LinkedX = this.group2LinkedRow % 2 === 1 ? 700 + this.layoutConfig.offset : 700;
                    this.group2LinkedY += this.layoutConfig.nodeInterval;
                    this.group2LinkedColumnCount = 0;
                }
            } else {
                returnY = this.group2NonLinkY;
                this.group2NonLinkColumnCount ++;
                if (this.group2NonLinkColumnCount === this.layoutConfig.maxCol) {
                    this.group2NonLinkX = 700;
                    this.group2NonLinkY += this.layoutConfig.nodeInterval;
                    this.group2NonLinkColumnCount = 0;
                }
            }
        }
        return returnY;
    }

}
