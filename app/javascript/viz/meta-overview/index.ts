import Oviz from "crux";
import { remove } from "crux/dist/utils/event";
import {controlGroupColors} from "oviz-common/palette";
import { register } from "page/visualizers";
import { registerEditorConfig } from "utils/editor";

import { getLeafOrder, main, meta } from "./data";
import { editorConfig, editorRef } from "./editor";
import { MetaOverview } from "./meta-overview";

const MODULE_NAME = "meta-overview";

function init() {
    if ( !window.gon || window.gon.module_name !== MODULE_NAME) return;
    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        renderer: "svg",
        width: 1600,
        height: 750,
        root: new MetaOverview(),
        theme: "light",
        data: {
            hiddenSamples: new Set(),
            gridSize: [4, 12],
            colors: {
                control: controlGroupColors[0],
                gout: controlGroupColors[1],
                na: "#777",
                abd0: "#333",
                // start: "#fff7f3",
                // end: "#0A2299",
                start: "#800000",
                org: "#FF5050",
                end: "#FFFF00",
            },
        },
        loadData: {
            ovTree: {
                fileKey: "ovTree",
                type: "newick",
                optional: true,
                loaded(d) {
                    // d = removeNodeLength(d);
                    // test();
                    this.data.species = getLeafOrder(d);
                    return d;
                },
            },
            ovMain: {
                fileKey: "ovMain",
                type: "tsv",
                dependsOn: ["ovTree"],
                loaded: main,
            },
            ovMeta: {
                fileKey: "ovMeta",
                type: "tsv",
                dsvRowDef: {Age: "int", BMI: "int", age: "int"},
                dependsOn: ["ovMain"],
                loaded: meta,
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
