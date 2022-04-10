import Oviz from "crux";
import { registerDefaultBioInfoComponents } from "crux/dist/element/global";
import { register } from "page/visualizers";
import { registerEditorConfig } from "utils/editor";
import { editorConfig, editorRef } from "./editor";

import template from "./template.bvt";

import {annoLoaded, main, matrixLoaded} from "./data";

registerDefaultBioInfoComponents();

const MODULE_NAME = "tree";

function init() {
    if (window.gon.module_name !== MODULE_NAME) return;
    const { visualizer } = Oviz.visualize({
        el: "#canvas",
        template,
        renderer: "svg",
        theme: "light",
        loadData: {
            anno: {
                type: "tsv",
                fileKey: "anno",
                loaded: annoLoaded,
            },
            matrix: {
                type: "tsv",
                fileKey: "matrix",
                loaded: matrixLoaded,
            },
            tree: {
                type: "tsv",
                fileKey: "tree",
                dependsOn: ["matrix"],
                loaded: main,
            },
        },
        setup() {
            registerEditorConfig(editorConfig(this), editorRef);
            if (this.data.tree.dataOpt.isRadical) {
                const r = this.data.tree.dataOpt.treeRadius + Math.ceil(this.data.tree.dataOpt.maxTextLength);
                this.size.width = 2 * r + 200;
                this.size.height = 2 * r;
            } else {
                this.size.width = this.size.height = 1000;
            }
            this.defineGradient("colorScale", "horizontal", ["#CFE1E9", "#1565C0"]);
        },

    });
    return visualizer;
}

register(MODULE_NAME, init);
