import Oviz from "crux";
import { editorConfig, editorRef } from "./editor";
import template from "./template.bvt";

import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import {register} from "page/visualizers";
import { rankDict, sortByRankKey } from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";

const yLabel = "Beta diversity";

const MODULE_NAME = "boxplot";

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: { GridPlot, ComplexBoxplot, EditText},
        data: {
            config: {
                yLabel,
                plotSize: [300, 300],
                showOutliers: true,
                drawP: true,
                drawViolin: false,
                drawScatter: true,
                hollowBox: false,
                xAxisRotated: true,
                labelFontSize: 12,
                labelOffsetVer: 30,
                tickFontSize: 12,
            },
            colors: { box: groupedChartColors[0], scatter: "pink",
                violin: "LightSteelBlue"},
        },
        loadData: {
            boxMain: {
                fileKey: "boxMain",
                type: "tsv",
                multiple: true,
                dsvHasHeader: false,
                loaded(data) {
                    this.data.mainDict = {};
                    const raw = {};
                    this.data.ranks = [];
                    data.sort((a, b) => sortByRankKey(a, b))
                        .forEach((d, i) => {
                            const rankLabel = rankDict[d[0][0]];
                            this.data.ranks.push(rankLabel);
                            const {rawData, boxData} = processRawData(d.slice(1, d.length));
                            this.data.mainDict[rankLabel] = boxData;
                            if (i === 0) {
                                this.data.rank = rankLabel;
                                this.data.data = boxData;
                            }
                            raw[rankLabel] = rawData;
                    });
                    this.data.ranks = this.data.ranks.map((x) =>  ({value: x, text: x}));
                    return raw;
                },
            },
            boxP: {
                fileKey: "boxP",
                type: "tsv",
                optional: true,
                multiple: true,
                loaded(data) {
                    this.data.pDict = {};
                    data.forEach(d => {
                        const rankLabel = rankDict[d.columns[0]];
                        const categories = this.data.mainDict[rankLabel].categories;
                        this.data.pDict[rankLabel] = d.map(r => {
                            const pValue = parseFloat(r[d.columns[1]]);
                            const [cat1, cat2] = r[d.columns[0]].split(":");
                            const pos1 = categories.indexOf(cat1);
                            const pos2 = categories.indexOf(cat2);
                            if (pos1 < pos2) {
                                return {source: cat1, target: cat2, pValue,
                                    sourcePos: pos1, targetPos: pos2,
                                };
                            } else {
                                return {source: cat2, target: cat1, pValue,
                                    sourcePos: pos2, targetPos: pos1,
                                };
                            }
                        });
                    });
                    return null;
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

export function registerBoxplot() {
    register(MODULE_NAME, init);
}

function processRawData(data: any[]) {
    const rawData = {};
    const categories = [];
    const values = [];
    data.forEach(d => {
        rawData[d[0]] = d.splice(1, d.length).map(x => parseFloat(x));
        categories.push(d[0]);
        values.push(rawData[d[0]]);
    });
    const boxData = processBoxData(values, categories);
    return {rawData, boxData};
}

register(MODULE_NAME, init);
