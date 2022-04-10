import Oviz from "crux";
import { editorConfig } from "./editor";
import template from "./template.bvt";

import {register} from "page/visualizers";
import { registerEditorConfig } from "utils/editor";

import {findUpperBound} from "utils/maths";

import {minmax} from "crux/dist/utils/math";
import {signedChartColors} from "oviz-common/palette";

const MODULE_NAME = "signed-barchart";

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        theme: "light",
        data: {
            colors: {
                ...signedChartColors,
            },
            config : {
                plotHeight: 600,
                plotWidth: 800,
                barWidth: 15,
            },
        },
        loadData:  {
            barchartData: {
                fileKey: `barchartData`,
                type: "tsv" ,
                dsvRowDef: {Zscore: ["float"]},
                loaded(data) {
                   const valueRange = minmax(data, "Zscore");
                   const lowerBound = -findUpperBound(valueRange[0] * -1, 1);
                   const upperBound = findUpperBound(valueRange[1], 1);
                   this.data.axisPos = -lowerBound / (upperBound - lowerBound);
                   this.data.plotHeight = 15 * data.length;
                   this.data.bounds = {lowerBound, upperBound};
                },
            },
        },
        setup() {
            registerEditorConfig(editorConfig(this));
        },
    });
    return visualizer;
}

register(MODULE_NAME, init);
