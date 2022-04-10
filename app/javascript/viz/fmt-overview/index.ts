
import Oviz from "crux";
import { FMT } from "./root";

import { register } from "page/visualizers";
import { registerEditorConfig } from "utils/editor";
import { main, meta } from "./data";

import { editorConfig, editorRef } from "./editor";
import { EditText } from "oviz-components/edit-text";

const MODULE_NAME = "fmt-overview";

function init() {
    if ( !window.gon || window.gon.module_name !== MODULE_NAME) return;
    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        root: new FMT(),
        components: { EditText },
        data: {
            labelAngle: 45,
            italicLabel: false,
            gridW: 12,
            plotHeight: 120,
            highlightSpecies: new Set([]),
        },
        theme: "light",
        loadData: {
            fmtMain: {
                fileKey: "fmtMain",
                type: "tsv",
                loaded: main,
            },
            fmtMeta: {
                fileKey: "fmtMeta",
                type: "tsv",
                dependsOn: ["fmtMain"],
                loaded: meta,
            },
        },
        setup() {
            registerEditorConfig(editorConfig(this), editorRef);
        },
    });
    return visualizer;
}

register(MODULE_NAME, init);
