import Oviz from "crux";
import template from "./template.bvt"
import { editorConfig, editorRef } from "./editor";
import { SignedHeatMap } from "viz/signed-heatmap/signed-heatmap";
import {savedTheme} from "oviz-common/mem-theme"
import {register} from "page/visualizers";
import { registerEditorConfig } from "utils/editor";

// reigister default color theme
const MODULE_NAME = "corr-heatmap";

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;
    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        theme: "light",
        components: {SignedHeatMap},
        data: {
            config: {
                rangeMin: 0,
                rangeMax: 0,
                isSym: true,
                gridH: 15,
            },
            colors: {
                "origin": "white",
                "positive range": "red",
                "negative range": "green",
                "group1": "#EC7063",
                "group2": "#58D68D",
            },
            heatmapDataP: null,
            groupData: null,
            rowTreeData: null,
            colTreeData: null,
        },
        loadData: {
            corrHeatmapData: {
                type: "tsv",
                fileKey: "corrHeatmapData",
                loaded(d) {
                    if (!d) return;
                    const rows = [];
                    const data = {};
                    const sampleKey = d.columns[0];
                    let [min, max] = [0, 0];
                    this.data.speciesMap = d.map(x => 
                        [getShortSpecies(x[sampleKey]), x[sampleKey]]);
                    d.forEach(line => {
                        const rowData = {};
                        const rowAttr = getShortSpecies(line[sampleKey]);
                        rows.push(rowAttr);
                        d.columns.forEach((col, i) => {
                            if (i === 0) return;
                            const h = {};
                            h["r"] = line[col];
                            if (parseFloat(line[col]) > max) max = line[col];
                            if (parseFloat(line[col]) < min) min = line[col];
                            rowData[col] = h;
                        });
                        data[rowAttr] = rowData;
                    });
                    return {rows, columns: d.columns.splice(1, d.columns.length), data,
                        range: {min, max}};
                },
            },
        },
        setup() {
            setUpRange(this);
            // registerEditorConfig(editorConfig(this), editorRef);
            if (this.data.corrHeatmapData.rows.length > 100) this.data.config.gridH = 10;
            else if (this.data.corrHeatmapData.rows.length > 60) this.data.config.gridH = 12;
        },
    });
    return visualizer;
}

function getShortSpecies(name) {
    const nameByRanks = name.split("|");
    return nameByRanks[nameByRanks.length - 1];
}
function setUpRange(v) {
    v.data.config.rangeMin = v.data.corrHeatmapData.range.min;
    v.data.config.rangeMax = v.data.corrHeatmapData.range.max;
}

// export default SignedHeatmap;

register(MODULE_NAME, init);

export function registerCorrHeatmap() {
    register(MODULE_NAME, init);
}
