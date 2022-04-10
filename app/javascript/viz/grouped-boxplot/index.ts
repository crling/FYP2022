import Oviz from "crux";
import {register} from "page/visualizers";
import { registerEditorConfig } from "utils/editor";
import { editorConfig } from "./editor";
import template from "./template.bvt";

import { findBoundsForValues } from "utils/maths";

import { groupedChartColors} from "oviz-common/palette";
import {rankDict} from "utils/bio-info";

const ylabel = "Relative abundance";
const rankLabelIndex = 0;
const classifiedIndex = 0;
const valueRange = [-8, 2];
const title = "grouped box plot";

// please change the displayed value range in the template by the prop: valueRange.
const MODULE_NAME = "grouped-boxplot";

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        data: {ylabel, title,
            config: {
                plotWidth: 1000,
                showOutliers: true,
                xLabelRotation: 45,
                rankIndex: 0,
            },
            colors: groupedChartColors,
        },
        loadData: {
            boxplotDataGrouped: {
                fileKey: "boxplotDataGrouped",
                type: "tsv",
                dsvHasHeader: true,
                multiple: true,
                loaded(d) {
                    // process rank info
                    const rankKeys = Object.keys(rankDict);
                    this.data.ranks = d.map(x => x.columns[0])
                                    .sort((a, b) => rankKeys.indexOf(a) - rankKeys.indexOf(b))
                                    .map((x, i) =>  ({value: i, text: rankDict[x]}));
                    this.data.boxDict = {};
                    const chosenRank = this.data.ranks[0].text;

                    d.forEach(data => {
                        const rankLabel = rankDict[data.columns[0]];
                        const categories = data.columns.slice(1);
                        const classifiedKey = data.columns[classifiedIndex];
                        const classifications = data.map(d => (d[classifiedKey])).filter((item, index, self) => {
                            return self.indexOf(item) === index; });
                        const boxData = [{values: [], outliers: [], means: [], categories}, {values: [], outliers: [], means: [], categories}];
                        const allValues = [];
                        categories.forEach((arr, i) => {
                            const initialData = [[], []];
                            data.forEach(d => {
                                allValues.push(parseFloat(d[arr]));
                                if (d[classifiedKey] === classifications[0]) {
                                    initialData[0].push(parseFloat(d[arr]));
                                } else {
                                    initialData[1].push(parseFloat(d[arr]));
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
                        const valueRange = findBoundsForValues(allValues, 2, false, 0.5);
                        this.data.boxDict[rankLabel] = {boxData, valueRange, categories, classifications};
                        if (chosenRank === rankLabel) this.data.boxData = {boxData, valueRange, categories, classifications};
                    });

                    return null;
                },
            },
        },
        setup() {
            this.data.plotWidth = 1000;
            registerEditorConfig(editorConfig(this));
        },
    });
    
    return visualizer;
}

register(MODULE_NAME, init);