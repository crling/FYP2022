import Oviz from "crux";
import { Component } from "crux/dist/element";
import { findBoundsForValues } from "utils/maths";
import { GridPlotOption } from "./grid-plot";
import template from "./scatter.bvt";

export interface ErrorEllipseDatum {
    dx: number;
    dy: number;
    ellipsePath: string;
    xAxisPath: string;
    yAxisPath: string;
}

export interface ScatterClusterDatum {
    center: {x, y};
    ellipseData: ErrorEllipseDatum;
}

export interface ComplextScatterplotOption extends GridPlotOption {
    hollow: boolean;
    scatterSize: number;
    hiddenSamples: Set<string>;
    scatterFill?: string;
    scatterStroke?: string;
    generateTooltip: (d) => string;
}
export class ComplexScatterplot extends Component<ComplextScatterplotOption> {

    public dataChanged: boolean = true;
    public rankChanged: boolean;
    public axisChanged: boolean;
    public config: any;
    public colors: string;

    public ranks: Array<{ value: string; text: string }>;
    public availableAxises: Array<{ value: string; text: string }>;

    protected scatterData: any;
    public scatterVectorData: any[];
    public vectorLabel: string;
    public groups: string[];
    public clusters: string[];

    public mainDict: Record<string, any>;
    public clusterDict;
    public sampleInfoDict: any;

    private markedScatter: string;

    private markedLines: [any, any] = [
        { x: 0, dashArray: "1,2", stroke: "#aaa"},
        { y: 0, dashArray: "1,2", stroke: "#aaa"},
    ];

    // private _dataChanged = true;

    public render = Oviz.t`${template}`;

    // public willRender() {
    //     // 
    //     if (this._firstRender) {
    //         this.scatterData = this.prop.data;
    //         this.hiddenSamples = this.prop.hiddenSamples;
    //     }
    // }
/*
    willRender() {
        if (this._firstRender) {
            this.legend1Pos = {x: 45, y: 115};
            this.legend2Pos = {x: 45, y: 55};
            const shapes = ["Circle", "Rect", "Triangle"];
            if (this.clusters) {
                this.colorMap = this.getMap(this.clusters, this.colors);
                if (this.groups) {
                    this.shapeMap = this.getMap(this.groups, shapes);
                    this.groupLegendData = this.groups.map((x, i) => {
                        return {type: "custom", label: x, fill: "grey"};
                    });
                }
            } else if (this.groups) {
                this.colorMap = this.getMap(this.groups, this.colors);
                this.groupLegendData = this.groups.map((x, i) => {
                    return {type: "custom", label: x, fill: this.colors[i]}
                });
            }
        }

        if (this.rankChanged) {
            this.rankLabel = this.ranks[this.config.rankIndex].text;
            this.scatterData = this.mainDict[this.rankLabel];
            this.availableAxises = this.scatterData.columns.filter((_, i) => i > 0)
                                .map((x, i) => ({"value": i, "text": x}));
            this.config.xAxisIndex = editorRef.xAxis.value = 0;
            this.config.yAxisIndex = editorRef.yAxis.value = 1;

            editorRef.xAxis.config.options = editorRef.yAxis.config.options = this.availableAxises;

            this.rankChanged = false;
        }

        if (this._firstRender || this.dataChanged) {
            this.xLabel = this.availableAxises[this.config.xAxisIndex].text;
            if (this.config.yAxisIndex === 1 && this.availableAxises.length === 1){
                this.yLabel = this.availableAxises[0].text;
                this.config.yAxisIndex = 0;
            }

            this.yLabel = this.availableAxises[this.config.yAxisIndex].text;
            this.parsedScatterData = this.scatterData.map((d, i) => {
                const datum = {sampleId: d.sampleId, 
                    group: this.sampleInfoDict[d.sampleId].group,
                    cluster: this.clusterDict ? this.clusterDict[d.sampleId][this.rankLabel] :null};
                datum[this.xLabel] = d[this.xLabel];
                datum[this.yLabel] = d[this.yLabel];
                return datum;
            });

            if (this.clusters) {
                this.categoryRange = this.rangeIsValid(this.config.categoryRange) ?  this.config.categoryRange
                    : findBoundsForValues(this.scatterData.map(d => d[this.xLabel]), 1, false, 0.1);
                this.valueRange = this.rangeIsValid(this.config.valueRange) ? this.config.valueRange
                    : findBoundsForValues(this.scatterData.map(d => d[this.yLabel]), 1, false, 0.1);
            } else {
                this.categoryRange = this.rangeIsValid(this.config.categoryRange) ?  this.config.categoryRange
                : findBoundsForValues(this.scatterData.map(d => d[this.xLabel]), 1);
                this.valueRange = this.rangeIsValid(this.config.valueRange) ? this.config.valueRange
                    : findBoundsForValues(this.scatterData.map(d => d[this.yLabel]), 1);
            }

            const svgRatioX = this.config.plotWidth / (this.categoryRange[1] - this.categoryRange[0]);
            const svgRatioY = this.config.plotHeight / (this.valueRange[1] - this.valueRange[0]);

            if (this.clusters) {
                const parsedData = {};
                this.clusters.forEach(key => {
                    const initialData = this.parsedScatterData.filter(x => x.cluster === key);
                    const clusterDatum = this.computeErrorEllipse(initialData, this.xLabel, this.yLabel,
                        svgRatioX, svgRatioY);
                    parsedData[key] = clusterDatum;
                });
                this.parsedClusterData = parsedData;
            }
            if (this.clusters) {
                this.colorMap = this.getMap(this.clusters, this.colors);
            } else if (this.groups) {
                this.colorMap = this.getMap(this.groups, this.colors);
            }
            this.dataChanged = false;
        }
    }
*/

// 这个是旧的椭圆算法
    protected computeErrorEllipse(samples, xIndex, yIndex, svgRatioX, svgRatioY): ScatterClusterDatum {
        const ellipseData = {cx: 0, cy: 0, rx: 0, ry: 0, rotationAngle: 0};
        const s = 5.991;
        const statX = new Oviz.algo.Statistics(samples.map(x => x[xIndex]));
        const statY = new Oviz.algo.Statistics(samples.map(y => y[yIndex]));

        ellipseData.cx =  statX.mean();
        ellipseData.cy = statY.mean();

        let varX = 0, varY = 0, cov = 0;
        samples.forEach(d => {
            varX += Math.pow( (d[xIndex] - statX.mean()) * svgRatioX, 2) / (samples.length - 1);
            varY += Math.pow( (d[yIndex] - statY.mean()) * svgRatioY, 2) / (samples.length - 1);
            cov += (d[xIndex] - statX.mean()) * svgRatioX * (d[yIndex] - statY.mean()) * svgRatioY / (samples.length - 1);
        });

        const eParams = {a: 1, b: -(varX + varY), c: varX * varY - Math.pow(cov, 2)};
        const eigenValue1 = (-eParams.b + Math.sqrt(Math.pow(eParams.b, 2) - 4 * eParams.a * eParams.c)) / (2 * eParams.a);
        const eigenValue2 = (-eParams.b - Math.sqrt(Math.pow(eParams.b, 2) - 4 * eParams.a * eParams.c)) / (2 * eParams.a );
        ellipseData.rx = Math.sqrt(s * Math.abs(eigenValue1));
        ellipseData.ry = Math.sqrt(s * Math.abs(eigenValue2));

        const rotationRad = Math.atan((varX - eigenValue1) / cov);
        ellipseData.rotationAngle  = rotationRad * 180 / Math.PI;
        const triFunctions = {
            sin(r) { return r * Math.sin(rotationRad); },
            cos(r) { return r * Math.cos(rotationRad); },
        };
        const dx = triFunctions.cos(ellipseData.rx);
        const dy = triFunctions.sin(ellipseData.rx);
        const ellipsePath = `M 0 0
                    A ${ellipseData.rx} ${ellipseData.ry} ${ellipseData.rotationAngle} 0 1 ${2 * dx} ${2 * dy}
                    A ${ellipseData.rx} ${ellipseData.ry} ${ellipseData.rotationAngle} 0 1 0 0 Z`;
        const center = {x: statX.mean(), y: statY.mean()};
        const ellipseDatum = {
            dx,
            dy,
            ellipsePath,
            xAxisPath: `M 0 0 L ${2 * dx} ${2 * dy}`,
            yAxisPath: `M ${dx - triFunctions.sin(ellipseData.ry)} ${dy + triFunctions.cos(ellipseData.ry)}
            L ${dx + triFunctions.sin(ellipseData.ry)} ${dy - triFunctions.cos(ellipseData.ry)}`,
        };
        return {center, ellipseData: ellipseDatum};
    }

    protected markScatter(d) {
        if (d.data.sampleId === this.markedScatter) {
            this.markedScatter = null;
            this.redraw();
        } else {
            this.markedScatter = d.data.sampleId;
            this.markedLines[0].x = d.pos;
            this.markedLines[1].y = d.value;
            this.$v.forceRedraw = true;
            this.redraw();
        }
    }

    protected hideScatter(d) {
        const result = confirm(`You want to hide ${d.data.sampleId}?`);
        if (result) {
            if (d.data.sampleId === this.markedScatter) {
                this.markedScatter = null;
            }
            d.data.show = false;
            this.redraw();
        }
    }

    protected generateScatterContent(scatter) {
        return Object.keys(scatter)
                     .reduce(((acc, cur) => {
                        if (!!scatter[cur])
                            if (typeof scatter[cur] === "number")
                                return acc + `${cur}: ${scatter[cur].toFixed(3)}<br>`;
                            else
                                return acc + `${cur}: ${scatter[cur]}<br>`;
                        else return acc;
                }), "");
    }

    protected getMap(keyArray, valueArray) {
        const map = new Map();
        keyArray.forEach((key, i) => {
            map.set(key, valueArray[i]);
        });
        return map;
    }

    public defaultProp() {
        return {
            ...super.defaultProp,
            scatterSize: 8,
            flip: false,
            hollow: false,
        };
    }
}

type ScatterData = {
    valueRange: [number, number],
    categoryRange: [number, number],
    data: any[],
    xLabel: string,
    yLabel: string,
}
// export function processRawData(data: any[], xLabel: string, yLabel: string): ScatterData {
//     const result = {valueRange: null, categoryRange: null, data: null, xLabel, yLabel};
//     data.forEach()
//     return result;

// }