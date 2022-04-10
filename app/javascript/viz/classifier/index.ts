import Oviz from "crux";
import { Color } from "crux/dist/color";
import * as TextSize from "crux/dist/utils/text-size";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "../../oviz-components/grid-plot";
import { editorConfig } from "./editor";
import template from "./template.bvt";

import {register} from "page/visualizers";
import { getGroups } from "utils/array";
import { registerEditorConfig } from "utils/editor";
import { computeLog, findBoundsForValues } from "utils/maths";

import { groupedChartColors} from "oviz-common/palette";

const MODULE_NAME = "classifier";

const plotSize = [200, 200];
const barGap = 4;

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: { GridPlot, EditText },
        data: {
            config: {
                rankIndex: 0,
                plotWidth: 1000,
                showOutliers: true,
                showP: true,
                hollowBox: true,
                xLabelRotation: 45,
                labelFontSize: 12,
                titleProps: {
                    x: 10,
                    fontSize: 14,
                },
            },
            colors: {
                // area: "rgb(233, 0,0, 0.3)",
                area: "pink",
                highlight: "red",
                bar: "lightGrey",
                barHighlight: "pink",
                // LightCoral
            },
            titles: ["Feature selection", "Training set"],
            getBoxColors: (x, hollow = true) => {
                if (hollow) return [x, "white", x];
                else return [Color.literal(x).darken(30).string,
                    Color.literal(x).lighten(10).string, "white" ];
            },
            updateNotePos(ev, el, deltaPos) {
                this.notesProps.x += deltaPos[0];
                this.notesProps.y += deltaPos[1];
                this.redraw();
            },
        },
        loadData: {
            clsPickData: {
                fileKey: "clsPickData",
                loaded(d) {
                    this.data.pickCats = d.split(",");
                    return null;
                },
            },
            clsBarData: {
                fileKey: "clsBarData",
                type: "tsv",
                loaded(data) {
                    const catKey = data.columns[0];
                    for (let i = 1; i < 3; i ++) {
                        const valueKey = data.columns[i];
                        const bars = data.map(d => [d[catKey], parseFloat(d[valueKey])])
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 11);
                        const categories = bars.map(x => x[0]);
                        const valueRange = [0, Math.ceil(Math.max(...bars.map(x => x[1])))];
                        this.data[`barData${i}`] = {
                            categories, valueRange, discreteCategory: true, flip: true,
                            data: bars, plotSize, invertValueAxis: true, gap: barGap,
                        };
                    }
                    this.data.barData1.yLabel = "Mean Decrease Accuracy";
                    this.data.barData2.yLabel = "Mean Decrease Gini";
                    return null;
                },
            },
            clsLineData: {
                fileKey: "clsLineData",
                type: "tsv",
                loaded(data) {
                    const xPosKey = data.columns[0];
                    const lineData = {};
                    const allValues = [];
                    let maxCat = 0;
                    for (let i = 6; i > 0; i --) {
                        lineData[data.columns[i]] = {key: data.columns[i], values: []};
                        data.forEach(d => {
                            const value = parseFloat(d[data.columns[i]]);
                            lineData[data.columns[i]].values.push([parseInt(d[xPosKey]), value]);
                            allValues.push(value);
                            if (parseInt(d[xPosKey]) > maxCat) maxCat = parseInt(d[xPosKey]);
                        });
                        lineData[data.columns[i]].values.sort((a, b) => a[0] - b[0]);
                    }
                    this.data.medianLineKey = data.columns[1];
                    const valueRange = findBoundsForValues(allValues, 2);
                    this.data.lineData = {
                        data: lineData, categoryRange: [1, maxCat], valueRange,
                        categoryUseLog: true, plotSize, margin: [0.05, 0.05],
                        dataHandler: {
                            default: {
                                values: d => d.values,
                            },
                        },
                        xLabel: "Number of variables", yLabel: "CV Error",
                    };
                    return null;
                },
            },
            clsPredictData: {
                fileKey: "clsPredictData",
                type: "tsv",
                dsvRowParser(row, _, columns) {
                    return {
                        sampleId: row[columns[0]],
                        value: parseFloat(row[columns[1]]),
                        group: row[columns[2]],
                    };
                },
                loaded(data) {
                    this.data.groups = getGroups(data, "group");
                    const allValues = data.map(x => x.value);
                    const valueRange = findBoundsForValues(allValues, 2);
                    const boxData = { values: [], outliers: [], means: [], categories: [...this.data.groups]};
                    this.data.groups.forEach((group, i) => {
                        const result = [];
                        const values = data.filter(d => d.group === group).map(d => d.value);
                        const stat1 = new Oviz.algo.Statistics(values);
                        const interQuartileRange = stat1.Q3() - stat1.Q1();
                        values.forEach(x => {
                            if ((x < stat1.Q3() - 1.5 * interQuartileRange) || (x > stat1.Q3() + 1.5 * interQuartileRange))  {
                                boxData.outliers.push([i, x]);
                            } else {
                                result.push(x);
                            }
                        });
                        const stat2 = new Oviz.algo.Statistics(result);
                        boxData.values.push([stat2.min(), stat2.Q1(), stat2.median(), stat2.Q3(), stat2.max()]);
                        boxData.means.push(stat2.mean());
                    });
                    this.data.boxData = {data: {boxData}, discreteCategories: true, plotSize,
                        valueRange, margin: [0.05, 0.05],
                        yLabel: "Propability of Disease"};
                    const scatterData = data.sort((a, b) => a.value - b.value)
                        .map((d, i) => ({pos: i + 1, ...d}));
                    this.data.scatterData = {data: scatterData, margin: [0.05, 0.05],
                        categoryRange: [0, scatterData.length], plotSize,
                        valueRange, xLabel: "Samples"};
                    return null;
                },
            },
            clsSpecifyData: {
                fileKey: "clsSpecifyData",
                type: "tsv",
                dsvRowParser(row, _, columns) {
                    return {
                        x: 1 - parseFloat(row[columns[0]]),
                        low: parseFloat(row[columns[1]]),
                        median: parseFloat(row[columns[2]]),
                        high: parseFloat(row[columns[3]]),
                    };
                },
                loaded(data) {
                    const line = [];
                    const area = [];
                    data = data.sort((a, b) => a.x - b.x);
                    data.forEach(d => {
                        line.push([d.x, d.median]);
                        area.push([d.x, d.low]);
                    });
                    data.sort((a, b) => b.x - a. x)
                        .forEach(d => {
                            area.push([d.x, d.high]);
                        });
                    this.data.specifyData = {
                        plotSize, valueRange: [0, 1], categoryRange: [0, 1],
                        yLabel: "sensitivity", xLabel: "1 - specify",
                        margin: [0.05, 0.05],
                        data: {
                            line: {values: line, key: "median"},
                            area: {values: area, key: "low-high"},
                        },
                    };
                },
            },
            clsNoteData: {
                fileKey: "clsNoteData",
                loaded(d) {
                    this.data.specifyNotes = d.split(/\r?\n/);
                    const width = Math.max(...this.data.specifyNotes.map(x =>
                        TextSize.measuredTextSize(x, 11).width));
                    const height = this.data.specifyNotes.length * 13;
                    this.data.notesProps = {
                        x: plotSize[0] - 2 - width,
                        y: plotSize[1] - height,
                        width, height,
                    };
                },
            },
        },
        setup() {
            // danger! possible conflicts with preset color names
            this.data.groups.forEach((g, i) => {
                this.data.colors[g] = groupedChartColors[i];
            });

            registerEditorConfig(editorConfig(this));
        },
    });

    return visualizer;
}

export function registerBoxplot() {
    register(MODULE_NAME, init);
}

register(MODULE_NAME, init);
