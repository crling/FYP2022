import Oviz from "crux"
import template from "./template.bvt"
import {register} from "page/visualizers";

import { findBoundsForValues, computeLog } from "utils/maths";
import { registerEditorConfig } from "utils/editor";
import { editorConfig } from "./editor";
import { groupedChartColors} from "oviz-common/palette"
import {rankDict} from "utils/bio-info";

const plotWidth = 500;
const ylabel = "Relative abundance -log10";
const classifiedIndex = 1;
const valueRange = [-8, 2];
const title = "grouped box plot";
// please change the displayed value range in the template by the prop: valueRange.
const MODULE_NAME = "grouped-boxplot-p";

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        data: {ylabel, title,
            config: {
                plotWidth: 500,
                showOutliers: true,
                xLabelRotation: 45,
                rankIndex: 0,
            },
            pValueRange: [0, 0.1],
            colors: groupedChartColors,
        },
        loadData: {
            boxplotDataGroupedP: {
                fileKey: "boxplotDataGroupedP",
                type: "tsv",
                dsvHasHeader: true,
                multiple: true,
                loaded(d) {
                    // rank sorting
                    const rankKeys = Object.keys(rankDict);
                    this.data.ranks = d.map(x => x.columns[1])
                                    .sort((a, b) => rankKeys.indexOf(a) - rankKeys.indexOf(b))
                                    .map((x, i) =>  ({value: i, text: rankDict[x]}));
                    this.data.boxDict = {};
                    this.data.pDict = {};
                    const chosenRank = this.data.ranks[0].text;
                    this.data.speciesDict = {};
                    d.forEach(data => {
                        const rankLabel = rankDict[data.columns[1]];
                        // only shows the species level
                        const shortSpecies = [];
                        this.data.speciesDict[rankLabel] = {};
                        for (let i = 2; i < data.columns.length; i ++) {
                            const splittedSpecies = data.columns[i].split("|");
                            shortSpecies.push([splittedSpecies[splittedSpecies.length - 1], data.columns[i]]);
                            this.data.speciesDict[rankLabel][splittedSpecies[splittedSpecies.length - 1]] = data.columns[i];
                        }
                        const columns = [data.columns[0], data.columns[1], ...shortSpecies.map(s => s[0])];
                        data = data.map(x => {
                            const parsedX = {};
                            parsedX[columns[0]] = x[columns[0]];
                            parsedX[columns[1]] = x[columns[1]];
                            shortSpecies.forEach(s => {
                                parsedX[s[0]] = x[s[1]];
                            });
                            return parsedX;
                        });

                        const pData = data.filter(x => x[columns[0]] === "p-value")[0];
                        data = data.filter(x => x[columns[0]] !== "p-value");

                        const categories = columns.slice(2);
                        if (categories.length > 50) categories.splice(50, categories.length - 50);
                        const classifiedKey = columns[classifiedIndex];
                        const classifications = data.map(d => (d[classifiedKey])).filter((item, index, self) => {
                            return self.indexOf(item) === index; });
                        const boxData = [{values: [], outliers: [], means: [], categories}, {values: [], outliers: [], means: [], categories}];
                        const allValues = [];
                        categories.forEach((arr, i) => {
                            const initialData = [[], []];
                            data.forEach(d => {
                                let x = parseFloat(d[arr]);
                                if (x === 0) x = -5;
                                else x = computeLog(x, 10);
                                allValues.push(x);
                                if (d[classifiedKey] === classifications[0]) {
                                    initialData[0].push(x);
                                } else {
                                    initialData[1].push(x);
                                }
                            });
                            classifications.forEach((_, j) => {
                                const result = [];
                                const stat1 = new Oviz.algo.Statistics(initialData[j]);
                                const interQuartileRange = stat1.Q3() - stat1.Q1();
                                initialData[j].forEach(d => {
                                    if ((d < stat1.Q3() - 1.5 * interQuartileRange) || (d > stat1.Q3() + 1.5 * interQuartileRange))  {
                                        boxData[j].outliers.push([i, d]);
                                    } else {
                                        result.push(d);
                                    }
                                });
                                const stat2 = new Oviz.algo.Statistics(result);
                                boxData[j].values.push([stat2.min(), stat2.Q1(), stat2.median(), stat2.Q3(), stat2.max()]);
                                boxData[j].means.push(stat2.mean());
                            });
                        });
                        const valueRange = findBoundsForValues(allValues, 2, false, 0.1);

                        this.data.pDict[rankLabel] = {pData: categories.map(c => parseFloat(pData[c])),
                         categories};
                        this.data.boxDict[rankLabel] = {boxData, valueRange, categories, classifications};
                        if (chosenRank === rankLabel) {
                            this.data.boxData = {boxData, valueRange, categories, classifications};
                            this.data.pData = this.data.pDict[rankLabel];
                        }
                    });
                    return null;
                },
            },
        },
        setup() {
            console.log(this["_data"]);
            if (this.data.boxData.categories.length * 20 > 500) {
                this.data.config.plotWidth = this.data.boxData.categories.length * 20;
                this.data.gridW = 20;
            } else {
                this.data.gridW = 500 / this.data.boxData.categories.length;
            }
            // const minBoxW = 12;
            // const mulNum = this.data.boxData.classifications.length;
            // const gridW = ((minBoxW + 2) * mulNum - 2) / 0.7;
            // if (this.data.boxData.categories.length * gridW > plotWidth) {
            //     this.data.config.plotWidth = this.data.boxData.categories.length * gridW;
            //     this.data.gridW = gridW;
            //     this.data.boxW = minBoxW;
            // } else {
            //     const boxGap = this.data.boxGap = 4;
            //     this.data.gridW = plotWidth / this.data.boxData.categories.length;
            //     this.data.boxW = (this.data.gridW * 0.7 - boxGap * (mulNum - 1)) / mulNum;
            // }
            registerEditorConfig(editorConfig(this));
        },
    });

    return visualizer;
}

register(MODULE_NAME, init);

export function registerGroupedBoxP() {
    register(MODULE_NAME, init);
}