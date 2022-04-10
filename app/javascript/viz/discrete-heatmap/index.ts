import Oviz from "crux"

import { editorConfig } from "./editor";
import template from "./template.bvt"
import {DiscreteHeatMap} from './discrete-heatmap'
import {register} from "page/visualizers";
import { registerEditorConfig } from "utils/editor";

const MODULE_NAME = "discrete-heatmap"
const defaultValues = [0, 0.5, 1];
const defaultInfo = ["did not use drug", "unknown", "used drug"];

const DiscreteHeatmap = {
    initViz,
    initVizWithDeepomics
}

function init() {
    if (window.gon.module_name !== MODULE_NAME) return;
    const {vizOpts} = initViz();
    Oviz.visualize(vizOpts);
}

function initViz(): any {
    const vizOpts = {
        el:"#canvas",
        template,
        components: {DiscreteHeatMap},
        data: {
            config: {
                colLabelRotation: 90,
            },
            values : defaultValues,
            valueMap: genDefaultValueMap(),
            colors: ["white", "#C7C7C7", "red"],
        },
        loadData: {
            heatmapDataD: {
                fileKey: 'heatmapDataD',                  
                type: "tsv",
                multiple: true,
                loaded(d) {
                    const values = [];
                    d = d.map(sample => {
                        const rows = [];
                        const data = [];
                        sample.forEach(row => {
                            const r = [];
                            rows.push(row[""]);
                            sample.columns.forEach(k => {
                                if (k !== "") {
                                    r.push(parseFloat(row[k]));
                                    if (!values.includes(parseFloat(row[k])))
                                        values.push(parseFloat(row[k]));
                                }
                            });
                            data.push(r);
                        });
                        return {rows, columns: sample.columns.splice(1, sample.columns.length), data};
                    });
                    this.data.values = values.sort();
                    return d;
                },
            },
        },
        setup() {
            registerEditorConfig(editorConfig(this));
        }
    };
    return {vizOpts};
}

function initVizWithDeepomics(fileDefs) {
    
}

function genDefaultValueMap() {
    const valueMap = new Map();
    valueMap.set(0, "did not use drug");
    valueMap.set(1, "used drug");
    valueMap.set(0.5, "uknown");
    return valueMap;
}

export default DiscreteHeatmap;

register(MODULE_NAME, init);

