import Oviz from "crux"
import template from "./template.bvt"
import {register} from "page/visualizers";

import {groupBy, getGroups} from "utils/array"

import { registerEditorConfig } from "utils/editor";
import { editorConfig } from "./editor";
import { groupedChartColors} from "oviz-common/palette"
import { computeLog } from "utils/maths";
const ylabel = "Relative abundance(log10)";
const classifiedIndex = 0;
const valueRange = [2.5, 3.5];
const title = "grouped box plot"
//please change the displayed value range in the template by the prop: valueRange.
const MODULE_NAME = 'continuos-grouped-boxplot'

interface BoxplotData {
    values: any[], 
    outliers: any[], 
    means: number[],
}

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        data: {ylabel, valueRange, title,
            config: {
                plotWidth: 1000,
                showOutliers: true,
                xLabelRotation: 45,
            },
            colors: groupedChartColors,
        },
        loadData: {
            boxplotDataCont: {
                fileKey: "boxplotDataCont",
                type: "tsv",
                dsvHasHeader: true,
                loaded(data) {
                    const categories = getGroups(data, data.columns[1]).sort((a,b)=> parseInt(a) - parseInt(b));
                    const groupedData = groupBy(data, data.columns[0]);
                    const parsedData = {};
                    const classifications = Object.keys(groupedData);
                    classifications.forEach(cls => {
                        const cData = groupedData[cls].map(d => {
                            d[data.columns[2]] = computeLog(parseInt(d[data.columns[2]]), Math.pow(10,2));
                            return d;
                        })
                        parsedData[cls] = groupBy(cData, data.columns[1]);
                    })
                    const boxData = [{values: [], outliers: [], means: [], categories: categories.map(d=> ` ${d} `)}, 
                        {values: [], outliers: [], means: [], categories: categories.map(d=> ` ${d} `)}];
                    categories.forEach((ctg, i) => {
                        classifications.forEach((cls, j) => {
                            if (!parsedData[cls][ctg]) return;
                            const initialData = parsedData[cls][ctg].map(d => d[data.columns[2]]);
                            const result = [];
                            const stat1 = new Oviz.algo.Statistics(initialData);
                            const interQuartileRange = stat1.Q3() - stat1.Q1();
                            initialData.forEach(d => {
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
                    this.data.xTicks = [];
                    categories.filter((d, i, arr) => {
                        if (i === 0 || d % 10 === 0 || i === arr.length - 1)
                            this.data.xTicks.push({value: d, index: i});
                    });
                    // this is hardcoded due to xy plot bug
                    this.data.boxData = boxData.sort((a,b)=> - a.values.length - b.values.length);
                    this.data.classifications = [classifications[1], classifications[0]];
                    this.data.categories = categories;
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