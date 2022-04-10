import Oviz from "crux";

import { editorConfig, editorRef } from "./editor";
import { ScatterBoxPlot } from "./scatter-box-plot";

import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { ComplexScatterplot } from "oviz-components/complex-scatterplot";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import { groupedChartColors } from "oviz-common/palette";
import { register } from "page/visualizers";
import { rankDict, sortByRankKey} from "utils/bio-info";
import DataUtils from "utils/data";
import { registerEditorConfig } from "utils/editor";
import { findBoundsForValues } from "utils/maths";

import { minmax } from "crux/dist/utils/math";
import { brewPalette, MetaInfo } from "viz/meta-overview/data";

const xAxisIndex = 0;
const yAxisIndex = 1;
const startColor = "blue";
const endColor = "red";

// const ageDiv = 40;
const shapes = ["Circle", "Triangle", "Rect"];

const colorScheme = Oviz.color.ColorSchemeGradient.create(startColor, endColor);

const MODULE_NAME = "scatter-box-plot";

function init() {

    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        root: new ScatterBoxPlot(),
        components: {GridPlot, EditText, ComplexBoxplot, ComplexScatterplot},
        renderer: "svg",
        width: 800,
        height: 800,
        data: {
            colorScheme, startColor, endColor, shapes,
            colors: {},
            mainGridLength: 300,
            boxGridHeight: 100,
            scatterConfig: {
                hasPadding: false,
                labelFontSize: 12,
                tickFontSize: 12,
                scatterSize: 8,
                hollow: false,
            },
            boxConfig: {
                showOutliers: true,
                drawViolin: false,
                drawScatter: false,
                hollowBox: false,
                labelFontSize: 12,
                tickFontSize: 12,
                useCat: true,
            },
            xBoxConfig: {
                invertValueAxis: true,
                flip: true,
                discreteCategory: true,
            },
            yBoxConfig: {
              
            },
        },
        loadData: {
            scatterBoxMain: {
                fileKey: "scatterBoxMain",
                type: "tsv",
                multiple: true,
                dependsOn: ["scatterBoxGroup"],
                loaded(data) {
                    this.data.mainDict = {};
                    this.data.ranks = [];
                    data.forEach((d, i) => {
                        // process rank information
                        const rankLabel = rankDict[d.columns[0]];
                        this.data.ranks.push({value: rankLabel, text: rankLabel});
                        const mainD = d.map(x => {
                            x["sampleId"] = x[d.columns[0]];
                            delete x[d.columns[0]];
                            return x;
                        });
                        this.data.mainDict[rankLabel] = d;
                        if (i === 0) {
                            this.data.rank = rankLabel;
                            setMainData(d, this);
                        }
                    });
                    return null;
                },
            },
            scatterBoxGroup: {
                fileKey: "scatterBoxGroup",
                type: "tsv",
                loaded(data) {
                    this.data.metaFeatures = data.columns.slice(1, data.columns.length);
                    // this.data.metaDict = {};
                    this.data.metaInfo = {};
                    this.data.discardedFeatures = [];
                    let curPos = 0;
                    let catKey: string, groupKey: string, colorKey: string;
                    this.data.metaFeatures.forEach((k, i) => {
                        if (DataUtils.isDistcint(data, k)) {
                            const values = data.map(x => x[k]).reduce((a, x) => {
                                if (a.indexOf(x) < 0 && (!DataUtils.isNull(x))) a.push(x);
                                return a;
                            }, []);
                            if (values.length > 10) {
                                this.data.discardedFeatures.push(k);
                                this.data.metaFeatures.splice(i, 1);
                                alert(`Meta info "${k}" contains more than 10 categories, will not be drawn`);
                            } else {
                                this.data.metaInfo[k] = new MetaInfo(k, false, null, null, values,
                                    curPos + values.length <= brewPalette.length ?
                                        groupedChartColors.slice(curPos, curPos + values.length) : null);
                                curPos += values.length;
                                if (!!groupKey && !catKey) {
                                    catKey = k;
                                }
                                if (!groupKey) groupKey = k;
                            }
                        } else {
                            const values = data.map(x => parseFloat(x[k]));
                            const [min, max] = minmax(values);
                            this.data.metaInfo[k] = new MetaInfo(k, true, min, max, values);
                            this.data.metaInfo[k].colorStart = "#0247FE";
                            this.data.metaInfo[k].colorEnd = "#FE4702";
                            this.data.metaInfo[k].updateColorGetter();
                            if (!colorKey) colorKey = k;
                        }
                    });
                    const sampleKey = data.columns[0];
                    if (!catKey) catKey = groupKey;
                    if (!colorKey) colorKey = groupKey;
                    this.data.categories = this.data.metaInfo[catKey].values;
                    this.data.catKey = catKey;
                    this.data.groupDict = {};
                    this.data.groups = this.data.metaInfo[groupKey].values;
                    this.data.groupLegend = this.data.groups.map((x, i) => {
                        return {label: x, fill: "#aaa", type: shapes[i]};
                    });
                    this.data.groupKey = groupKey;
                    data.forEach(x => {
                        this.data.groupDict[x[sampleKey]] = x;
                    });
                    this.data.colorKey = colorKey;
                    this.data.shapeDict = {};
                    this.data.groups.forEach((k, i) => this.data.shapeDict[k] = shapes[i]);
                    return null;
                },
            },
        },
        setup() {
            console.log(this["_data"]);

            // set cat colors
            this.data.colors.cats = this.data.categories.map(x => this.data.metaInfo[this.data.catKey].color(x));
            const colorMetaInfo = this.data.metaInfo[this.data.colorKey];
            if (colorMetaInfo.isNumber) {
                this.data.colors.classes = [colorMetaInfo.colorStart, colorMetaInfo.colorEnd];
            } else {
                this.data.colors.classes = colorMetaInfo.values.map(x => colorMetaInfo.color(x));
                this.data.classLegend = colorMetaInfo.values.map((x, i) => {
                    return {label: x, fill: colorMetaInfo.color(x), type: "Rect"};
                });
            }
            this.data.hiddenSamples = new Set();
            this.defineGradient("bg", "horizontal", [startColor, endColor]);
            registerEditorConfig(editorConfig(this), editorRef);
            this.data.data.generateTooltip =  (d) => {
                return [this.data.xLabel, this.data.yLabel, ...this.data.metaFeatures].map(k =>
                    `${k}: ${typeof d[k] === "number" ?  d[k].toFixed(3) : d[k]}<br>`).join("");
            };
            this.data.legendWidth = this.data.boxGridHeight + 40;
        },
    });

    return visualizer;
}

export const setMainData = (d, v, xLabel?, yLabel?) => {
    v.data.axises = d.columns.slice(1).map(x => ({value: x, text: x}));
    const chosenX = xLabel || v.data.axises[xAxisIndex].value;
    const chosenY = yLabel || v.data.axises[yAxisIndex].value;
    v.data.xLabel = chosenX;
    v.data.yLabel = chosenY;
    v.data.scatterData = [];
    processRawData(d, v);

    const shapeGetter = (s) => v.data.shapeDict[s[v.data.groupKey]]
    const groups = v.data.metaInfo[v.data.groupKey].values;
    const colorGetter = (s) => v.data.metaInfo[v.data.colorKey].color(s[v.data.colorKey]);
    v.data.data = {
        xLabel: v.data.xLabel, yLabel: v.data.yLabel,
        data: v.data.scatterData,
        valueRange: v.data.yRange,
        categoryRange: v.data.xRange,
        shapeGetter, colorGetter,
    };
    v.data.samples =  d.map(x => x.sampleId);
    v.data.boxDataX.valueRange = v.data.data.categoryRange;
    v.data.boxDataY.valueRange = v.data.data.valueRange;
};

const processRawData = (d, v) => {
    const xValues = [];
    const yValues = [];
    d.forEach(x => {
        const xValue = parseFloat(x[v.data.xLabel]);
        const yValue = parseFloat(x[v.data.yLabel]);
        const temp = {sampleId: x.sampleId,
            show: true,
            pos: xValue,
            value: yValue,
            // values: [xValue, yValue]
            ...v.data.groupDict[x.sampleId]};
        temp[v.data.xLabel] = xValue;
        temp[v.data.yLabel] = yValue;
        v.data.scatterData.push(temp);
        xValues.push(xValue);
        yValues.push(yValue);
    });
    v.data.xRange = findBoundsForValues(xValues, 2, false, 0.1);
    v.data.yRange = findBoundsForValues(yValues, 2, false, 0.1);

    const categories = v.data.categories;
    const xBoxValues = categories.map(_ => []);
    const yBoxValues = categories.map(_ => []);
    v.data.scatterData.forEach(x => {
        const catIndex = categories.indexOf(x[v.data.catKey]);
        xBoxValues[catIndex].push(x.pos);
        yBoxValues[catIndex].push(x.value);
    });
    v.data.boxDataX = processBoxData(xBoxValues, categories);
    v.data.boxDataY = processBoxData(yBoxValues, categories);
};

register(MODULE_NAME, init);

export function registerScatterBoxPlot() {
    register(MODULE_NAME, init);
}
