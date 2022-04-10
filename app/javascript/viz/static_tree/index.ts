import Oviz from "crux";
import {annoLoaded, main, matrixLoaded} from "viz/tree/data";
import template from "viz/tree/template.bvt";

export function init(id, path, config) {
    Oviz.visualize({
        el: id,
        template,
        renderer: "svg",
        height: 1400,
        width: 2000,
        theme: "light",
        loadData: {
            anno: {
                type: "tsv",
                url: path["anno"],
                loaded: annoLoaded,
            },
            matrix: {
                type: "tsv",
                url: path["matrix"],
                loaded: matrixLoaded,
            },
            tree: {
                type: "tsv",
                url: path["tree"],
                dependsOn: ["matrix"],
                loaded: main,
            },
        },
        setup() {
            if (this.data.tree.dataOpt.isRadical) {
                const r = this.data.tree.dataOpt.treeRadius + Math.ceil(this.data.tree.dataOpt.maxTextLength);
                this.size.width = 2 * r + 200;
                this.size.height = 2 * r;
            } else {
                this.size.width = this.size.height = 1000;
            }
        },
    });
}
