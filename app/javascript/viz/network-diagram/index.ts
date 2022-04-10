import Oviz from "crux";
import template from "./template.bvt";
import { NetworkDiagram } from "./network";
import { registerEditorConfig } from "utils/editor";
import { editorConfig, editorRef } from "./editor";

import {register} from "page/visualizers";

const MODULE_NAME = 'network-diagram'

const geneColors = [ "#73A79E",
    "#C7C88F", "#9895AC", "#C46A60", "#6A8EA7", "#C69054",
    "#8FAF59", "#C5A2B4", "#ACACAC"];

Oviz.use.theme("mh-light", {
    extends: "light",
    colors: {
        primary: "#5aae61",
        path: "white",
    },
    schemes: {
        phylumScheme: geneColors,
        hueScheme: getTestColors(),
        satScheme: getTestColors1(),
    },
});

function getTestColors(): string[] {
    const colors = [];
    const Color = Oviz.color.Color;
    let initColor = Color.hsl(0, 75, 75);
    colors.push(initColor.string);
    for (let i = 1; i < 20; i++) {
        initColor = initColor.shiftHue(20);
        colors.push(initColor.string);
    }
    return colors;
}

function getTestColors1(): string[] {
    const colors = [];
    const Color = Oviz.color.Color;
    let initColor = Color.hsl(0, 50, 50);
    colors.push(initColor.string);
    for (let i = 1; i < 20; i++) {
        initColor = initColor.shiftHue(20);
        colors.push(initColor.string);
    }
    return colors;
}
function isEmpty(str: string): boolean {
    if ( !str || str.trim() === "" || str === "NA") return true;
    return false;
}
function init() {
    if (window.gon.module_name !== MODULE_NAME) return;

    const { visualizer } = Oviz.visualize({
        el: "#canvas",
        template,
        theme: "mh-light",
        components: {NetworkDiagram},
        data:  {
            config: {
                showNodeNames: false,
            },
        },
        loadData: {
            networkEdges: {
                fileKey: "networkEdges",
                type: "tsv",
                loaded(d) {
                    const validEdges = [];
                    d.forEach( edge => {
                        if (!isEmpty(edge.Target)) 
                            validEdges.push({
                                source: edge.Source,
                                target: edge.Target,
                                correlation: edge.Correlation
                            });
                    });
                    return validEdges;
                }
            },
            networkNodes: {
                fileKey: "networkNodes",
                type: "tsv",
                loaded(d) {
                    const phylums = {};
                    d.forEach( node => {
                        if (!isEmpty(node.NodePhylum)) {
                            if (isEmpty(node.NodeGenus)) node.NodeGenus = "";
                            else {
                                if (!phylums[node.NodePhylum])
                                    phylums[node.NodePhylum] = [node.NodeGenus];
                            else if (!phylums[node.NodePhylum].includes(node.NodeGenus))
                                    phylums[node.NodePhylum].push(node.NodeGenus);
                            }
                        } else {
                            node.NodePhylum = "";
                            node.NodeGenus = "";
                        }
                    });
                    Object.keys(phylums).forEach( k => phylums[k] = phylums[k].sort());
                    phylums["Other"] = ["Unclassified"];
                    this.data.phylums = phylums;
                    this.data.nodeColorMap = initializeNodeColors(phylums);
                    return d;
                },
            },
        },
        setup() {
            registerEditorConfig(editorConfig(this));
        },
    });
    return [visualizer, {
        theme: {
            light: "mh-light",
            dark: "dark",
        },
    }];
}

function initializeNodeColors(phylums): any {
    const colorMap = {};
    let j = 0;
    const Color = Oviz.color.Color;
    Object.keys(phylums).forEach(k => {
        colorMap[k] = {};
        const initColor = Color.hsl(j, 75, 70);
        const hueInterval = 20;
        if (phylums[k].length <= 5) {
            // let counter = 0;
            phylums[k].forEach((genus, i) => {
                colorMap[k][genus] = initColor.shiftHue(Math.ceil(i / 3) * hueInterval)
                                            .darken(20 * (i % 3)).string;
            });
            j = j + Math.ceil(phylums[k].length / 3) * hueInterval;
        } else {
            phylums[k].forEach((genus, i) => {
                colorMap[k][genus] = initColor.shiftHue(Math.ceil(i / 3) * hueInterval)
                                            .darken(20 * (i % 3)).saturate(10 * (i % 2 )).string;
            });
            j = j + Math.ceil(phylums[k].length / 3) * hueInterval;
        }
    });
    const unknown = {Unclassified: Color.rgb(200,200,200).string};
    colorMap["Other"] = unknown;
    return colorMap;
}

register(MODULE_NAME, init);
