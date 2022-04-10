
import Oviz from "crux";
import { Color } from "crux/dist/color";
import { Component, XYPlotOption } from "crux/dist/element";
import { isThisTypeNode } from "typescript";
import { findBoundsForValues } from "utils/maths";
import template from "./box.bvt";
import { GridPlotOption } from "./grid-plot";

interface ComplexBoxplotOption extends GridPlotOption {
    drawP: boolean;
    showOutliers: boolean;
    drawBox: boolean;
    drawViolin: boolean;
    drawScatter: boolean;
    pData: any;
    hollowBox: boolean;
    getColor: (pos: number) => string;
    getScatterColor: (pos: number) => string;
    getViolinColor: (pos: number) => string;
    colors: any;
    useCat: boolean;
}

export class ComplexBoxplot extends Component<ComplexBoxplotOption> {

    protected boxMax: number;
    protected offsetY: number = 0;
    protected getColor;
    protected getViolinColor;
    protected getScatterColor;
    protected violinFillProps;

    public render() {
        return this.t`${template}`;
    }

    public willRender() {
        if (this._firstRender) {
            // const this.prop = {values: [], categories: []};
            if (this.prop.getColor) this.getColor = this.prop.getColor;
            else this.getColor = (pos) => this.prop.useCat ? this.prop.colors.cats[pos]
                : this.prop.colors?.box || "pink";
            if (this.prop.getScatterColor) this.getScatterColor = this.prop.getScatterColor;
            else this.getScatterColor = (pos) => this.prop.colors?.scatter || "#aaa";
            if (this.prop.getViolinColor) this.getViolinColor = this.prop.getViolinColor;
            else this.getViolinColor = (pos) => (this.prop.useCat ? this.prop.colors.cats[pos]
                        : this.prop.colors?.violin || "lightsteelblue");
            if (this.prop.useCat) {
                this.violinFillProps = {fill: this.prop.colors.cats};
            } else {
                this.violinFillProps = {fill: this.getViolinColor(0)};
            }
        }
        // @ts-ignore
        this.boxMax = this.prop.data.boxData.max;
    }

    protected getBoxColors(x) {
        // [stroke, fill]
        if (this.prop.hollowBox)
            return [Color.literal(x).darken(10).string, "#fff", x];
        else return ["#333", x, "#333" ];
    }

    public defaultProp() {
        return {
            ...super.defaultProp(),
            drawBox: true,
            showOutliers: true,
            drawViolin: false,
            drawScatter: false,
            drawP: true,
            hollowBox: true,
            // getColor: (pos: number) => "green",
            // getScatterColor: (pos: number) => "#aaa",
        };
    }

    protected dragP(ev, el, delta) {
        this.offsetY += delta[1];
        this.redraw();
    }
}
export type BoxData = {
    categories: string[];
    values: any[];
    outliers: any[];
    means: any[];
    min?: number;
    max?: number;
};

export function processBoxData(values: number[][], categories: string[]): any {
    const boxData: BoxData = {
        categories,
        values: [],
        outliers: [],
        means: [],
    };
    const violinData: any = {
        categories, values: [], violins: [],
    };
    let min, max;
    categories.forEach((_, i) => {
        const stat1 = new Oviz.algo.Statistics(values[i]);
        if (i === 0) {
            min = stat1.min();
            max = stat1.max();
        } else if (stat1.min() < min) min = stat1.min();
        else if (stat1.max() > max) max = stat1.max();
        const hist = new Oviz.algo.Histogram(values[i], "count");
        violinData.violins.push({stat: stat1, bins: hist.getBins(),
            maxY: hist.getMax()});
        violinData.values.push([stat1.min(), stat1.max()]);
        const interQuartileRange = stat1.Q3() - stat1.Q1();
        const boxVals = [];
        values[i].forEach(d => {
            if ((d < stat1.Q3() - 1.5 * interQuartileRange) || (d > stat1.Q3() + 1.5 * interQuartileRange))  {
                boxData.outliers.push([i, d]);
            } else {
                boxVals.push(d);
            }
        });
        const stat2 = new Oviz.algo.Statistics(boxVals);
        boxData.values.push([stat2.min(), stat2.Q1(), stat2.median(), stat2.Q3(), stat2.max()]);
        boxData.means.push(stat2.mean());
    });
    boxData.max = max;
    boxData.min = min;

    const result = {
        data: { boxData, violinData,
            scatterData: categories.map((pos, i) =>
                ({pos, values: values[i] })),
        }, categories,
        valueRange: findBoundsForValues([min, max], 2, false, 0.5),
    };
    return result;
}
