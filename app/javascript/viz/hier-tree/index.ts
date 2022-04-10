import Oviz from "crux"
import template from "./template.bvt"
import {register} from "page/visualizers";
import { getGroups} from "utils/array";
// import * as d3 from "d3";
// import * as text_size from "crux/dist/utils/text-size";
import {findBoundsForValues} from "utils/maths";

import { registerEditorConfig } from "utils/editor";
// import { editorConfig } from "./editor";
import { groupedChartColors} from "oviz-common/palette"
import { schemeSet1, schemeSet2, schemeSet3 } from "d3-scale-chromatic";

const ylabel = "Relative abundance(log10)";
const classifiedIndex = 0;
const valueRange = [2.5, 3.5];
const title = "grouped box plot"

const MODULE_NAME = "hier-tree";

interface BoxplotData {
    values: any[], 
    outliers: any[], 
    means: number[],
}
const getDistinctValues = (arr) => {
    return arr.reduce((r, x) => {
        if (!r.includes(x)) r.push(x);
        return r;
        }, []);
}
let leavesCount = 0;

function assignCluster(treeNode, clusterDict) {
    if (treeNode.children) {
        const childrenCluters = treeNode.children.map(c => assignCluster(c, clusterDict));
        const distinctClusters = getDistinctValues(childrenCluters);
        if (distinctClusters.length === 1 && distinctClusters[0] !== null) {
            // treeNode.data = {cluster: dictinctClusters[0]}
            treeNode.cluster = distinctClusters[0];
            return distinctClusters[0];
        } else {
            return null;
        }
    } else {
        leavesCount ++;
        return clusterDict[treeNode.name];
    }
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
            colors: {
                naColor: "#aaa",
            },
            gridSize: 10,
        },
        loadData: {
            hierTreeData: {
                fileKey: "hierTreeData",
                type: "newick",
                dependsOn: ["hierClusterData"],
                loaded(data) {
                    assignCluster(data, this.data.clusterDict);
                    return data;
                },
            },
            hierClusterData: {
                fileKey: "hierClusterData",
                type: "tsv",
                loaded(data) {
                    this.data.clusterDict = {};
                    this.data.clusters = getGroups(data, data.columns[1]);
                    this.data.colorMap = {};
                    this.data.clusterLegendData = [];
                    this.data.clusters.forEach((c, i) => {
                        this.data.colorMap[c] = groupedChartColors[i];
                        this.data.clusterLegendData.push({label: c, fill: groupedChartColors[i]});
                    });
                    data.forEach(x => {
                        this.data.clusterDict[x[data.columns[0]]] = x[data.columns[1]];
                    });
                    return null;
                }
            },
            hierGroupData: {
                fileKey: "hierGroupData",
                type: "tsv",
                loaded(data) {
                    this.data.groupDict = {};
                    this.data.groups = getGroups(data, data.columns[1]);
                    this.data.groupColorMap = {};
                    this.data.groupLegendData = [];
                    this.data.groups.forEach((g, i) => {
                        this.data.groupColorMap[g] = schemeSet1[i];
                        this.data.groupLegendData.push({label: g, fill: schemeSet1[i]});
                    });
                    
                    data.forEach(x => {
                        
                        this.data.groupDict[x[data.columns[0]]] = x[data.columns[1]];
                    });
                    return null;
                }
            }
        },
        setup() {            
            this.data.treeWidth = 15 * leavesCount;
            this.size.width = 15 * leavesCount + 100;
            // registerEditorConfig(editorConfig(this));
        },
    });
    
    return visualizer;
}

register(MODULE_NAME, init);

export function registerHierTree() {
    register(MODULE_NAME, init);
}