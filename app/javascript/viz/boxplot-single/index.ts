import Oviz from "crux";
import template from "./template.bvt";

import { groupedChartColors } from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { EditText } from "oviz-components/edit-text";
import { register } from "page/visualizers";
import { getGroups } from "utils/array";
import { rankDict, sortByRank } from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";
import { GridPlot } from "../../oviz-components/grid-plot";
import { editorConfig, editorRef } from "./editor";

// please change the displayed value range in the template by the prop: valueRange.
const MODULE_NAME = "boxplot-single";

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        data: {
            config: {
                yLabel: "Alpha Diversity",
                rankIndex: 0,
                plotSize: [300, 300],
                showOutliers: true,
                drawP: true,
                drawViolin: false,
                drawScatter: true,
                hollowBox: true,
                xAxisRotated: true,
                labelFontSize: 12,
                labelOffsetVer: 30,
                tickFontSize: 12,
                getColor(pos) {
                    return groupedChartColors[0];
                },
            },
            colors: { box: groupedChartColors[0], scatter: "pink",
                violin: "LightSteelBlue"},
        },
        components: { GridPlot, ComplexBoxplot, EditText},
        loadData: {
            boxSingleMain: {
                fileKey: "boxSingleMain",
                type: "tsv",
                dependsOn: ["boxSingleGroup"],
                dsvHasHeader: true,
                loaded(data) {
                    const samples = data.columns.slice(1);
                    const rankKey = data.columns[0];
                    this.data.ranks = [];
                    this.data.mainDict = {};
                    data.forEach(d => {
                        const rankLabel = rankDict[d[rankKey]];
                        this.data.ranks.push(rankLabel);
                        const allValues = [];
                        const values = this.data.categories.map(x => []);
                        samples.forEach(s => {
                            const v = parseFloat(d[s]);
                            if (!isNaN(v)) allValues.push(v);
                            const catIndex = this.data.categories.indexOf(this.data.groupDict[s]);
                            values[catIndex].push(v);
                        });
                        const boxData = processBoxData(values, this.data.categories);
                        this.data.mainDict[rankLabel] = boxData;
                    });
                    this.data.ranks = this.data.ranks.sort((a, b) => sortByRank(a, b));
                    this.data.rank = this.data.ranks[3] || this.data.ranks[this.data.ranks.length - 1];
                    this.data.data = this.data.mainDict[this.data.rank];
                    this.data.ranks = this.data.ranks.map((x) =>  ({value: x, text: x}));
                    return null;
                },
            },
            boxSingleGroup: {
                fileKey: "boxSingleGroup",
                type: "tsv",
                dsvHasHeader: true,
                loaded(data) {
                    this.data.groupDict = {};
                    this.data.categories = getGroups(data, data.columns[1]);
                    data.forEach(d => {
                        this.data.groupDict[d[data.columns[0]]] = d[data.columns[1]];
                    });
                    return null;
                },
            },
            boxSingleP: {
                fileKey: "boxSingleP",
                type: "tsv",
                dsvHasHeader: true,
                dependsOn: ["boxSingleMain"],
                loaded(data) {
                    this.data.pDict = {};
                    data.forEach(d => {
                        const rankLabel = rankDict[d[data.columns[0]]];
                        const p = parseFloat(d[data.columns[1]]);
                        if (!isNaN(p)) {
                            this.data.pDict[rankLabel] = [{source: this.data.categories[0],
                                target: this.data.categories[1],
                                pValue: p,
                                sourcePos: 0, targetPos: 1,
                            }];
                        }
                    });
                    this.data.pValue = this.data.pDict[this.data.rank];
                },
            },
        },
        setup() {
            console.log(this["_data"]);
            registerEditorConfig(editorConfig(this), editorRef);
        },
    });

    return visualizer;
}

register(MODULE_NAME, init);

export function registerBoxplotSingle() {
    register(MODULE_NAME, init);
}
