import { setSyntheticLeadingComments } from "typescript";
import { EditorDef } from "utils/editor";
import { generateBoxConfig } from "viz/boxplot/editor";
import { setMainData } from ".";

export const editorRef = {} as any;

function run(v) {
    v.forceRedraw = true;
    v.run();
}
function scatterConfig(v) {
    return ({
        id: "scatter",
        title: "Scatterplot Content",
        layout: "single-page",
        icon: "",
        view: {
            type: "list",
            items: [
                {
                    title: "",
                    ref: "filterSamples",
                    type: "vue",
                    component: "filter-samples-bind",
                    data: {
                        get samples() {
                            return v.data.samples;
                        },
                        get title() {
                            return "Filter Samples";
                        },
                        callback(samples) {
                            console.log(samples);
                        },
                    },
                },
            ],
        },
    });
}
function xyConfig(v) {
    return [{
        id: "xData",
        name: "X-Axis",
        view: {
            type: "list",
            items: [
                {
                    ref: "xAxis",
                    title: "X-Axis",
                    type: "select",
                    options: v.data.axises,
                    value: {
                        current: v.data.xLabel,
                        callback(d) {
                            setMainData(v.data.mainDict[v.data.rank], v, d);
                            editorRef.xLower.value = v.data.data.categoryRange[0];
                            editorRef.xUpper.value = v.data.data.categoryRange[1];
                            run(v);
                        },
                    },
                },
                {
                    ref: "xLower",
                    title: "X Range Lower Bound",
                    type: "input",
                    value: {
                        current:  v.data.data.categoryRange[0],
                        callback(d) {
                            v.data.boxDataX.valueRange[0] = v.data.data.categoryRange[0] = parseFloat(d);
                            run(v);
                        },
                    },
                },
                {
                    ref: "xUpper",
                    title: "X Range Upper Bound",
                    type: "input",
                    value: {
                        current: v.data.data.categoryRange[1],
                        callback(d) {
                            v.data.boxDataX.valueRange[1] = v.data.data.categoryRange[1] = parseFloat(d);
                            run(v);
                        },
                    },
                },
            ],
        },
    },
    {
        id: "yData",
        name: "Y-Axis",
        view: {
            type: "list",
            items: [
                {
                    ref: "yAxis",
                    title: "Y-Axis",
                    type: "select",
                    options: v.data.axises,
                    value: {
                        current: v.data.yLabel,
                        callback(d) {
                            setMainData(v.data.mainDict[v.data.rank], v, null, d);
                            editorRef.yLower.value = v.data.data.valueRange[0];
                            editorRef.yUpper.value = v.data.data.valueRange[1];
                            run(v);
                        },
                    },
                },
                {
                    ref: "yLower",
                    title: "Y Range Lower Bound",
                    type: "input",
                    value: {
                        current:  v.data.data.valueRange[0],
                        callback(d) {
                            v.data.boxDataY.valueRange[0] = v.data.data.valueRange[0] = parseFloat(d);
                            run(v);
                        },
                    },
                },
                {
                    ref: "yUpper",
                    title: "Y Range Upper Bound",
                    type: "input",
                    value: {
                        current: v.data.data.valueRange[1],
                        callback(d) {
                            v.data.boxDataY.valueRange[1] = v.data.data.valueRange[1] = parseFloat(d);
                            run(v);
                        },
                    },
                },
            ],
        },
    },
];
}
export function editorConfig(v): EditorDef {

    const metaOpts = Object.keys(v.data.metaInfo).map(x => ({value: x,
                            text: `${x} (${v.data.metaInfo[x].isNumber ? "continuous" : "discrete"})`}));
    const metaOptsDiscrete = Object.keys(v.data.metaInfo)
                                    .filter(k => !v.data.metaInfo[k].isNumber)
                                    .map(x => ({value: x, text: x}));

    return {
        sections: [
            {
                id: "data",
                title: "Data",
                layout: "tabs",
                tabs: [
                    {
                        id: "gData",
                        name: "General",
                        view: {
                            type: "list",
                            items: [
                                {
                                    type: "select",
                                    title: "Taxonomic rank",
                                    options: v.data.ranks,
                                    value: {
                                        current: v.data.rank,
                                        callback(d) {
                                            v.data.rank = d;
                                            setMainData(v.data.mainDict[d], v);
                                            run(v);
                                        },
                                    },
                                },
                                {
                                    type: "select",
                                    title: "Scatter shape by",
                                    options: metaOptsDiscrete,
                                    value: {
                                        current: v.data.groupKey,
                                        callback(d) {
                                            v.data.groupKey = d;
                                            v.data.groups = v.data.metaInfo[d].values;
                                            v.data.shapeDict = {};
                                            v.data.groups.forEach((x, i) => {
                                                v.data.shapeDict[x] = v.data.shapes[i];
                                            });
                                            v.data.data.shapeGetter = (x) => v.data.shapeDict[x[d]];
                                            run(v);
                                        },
                                    },
                                },
                                {
                                    type: "select",
                                    title: "Scatter color by",
                                    options: metaOpts,
                                    value: {
                                        current: v.data.colorKey,
                                        callback(d) {
                                            v.data.colorKey = d;
                                            const colorMetaInfo = v.data.metaInfo[v.data.colorKey];
                                            v.data.data.colorGetter = (s) => v.data.metaInfo[v.data.colorKey].color(s[v.data.colorKey]);
                                            v.data.classLegend = colorMetaInfo.values.map((x, i) => {
                                                return {label: x, fill: colorMetaInfo.color(x), type: "Rect"};
                                            });
                                            run(v);
                                        },
                                    },
                                },
                                {
                                    type: "select",
                                    title: "Box category by",
                                    options: metaOptsDiscrete,
                                    value: {
                                        current: v.data.catKey,
                                        callback(d) {
                                            v.data.catKey = d;
                                            v.data.categories = v.data.metaInfo[d].values;
                                            setMainData(v.data.mainDict[v.data.rank], v);
                                            run(v);
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    ...xyConfig(v),

                ],
            },
            {
                id: "setting-general",
                title: "General settings",
                layout: "single-page",
                view: {
                    type: "list",
                    items: [
                        {
                            title: "grid length",
                            type: "input",
                            value: {
                                current: v.data.mainGridLength,
                                callback(d) {
                                    v.data.mainGridLength = parseFloat(d);
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "box height",
                            type: "input",
                            value: {
                                current: v.data.boxGridHeight,
                                callback(d) {
                                    v.data.boxGridHeight = parseFloat(d);
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "scatter size",
                            type: "input",
                            value: {
                                current: v.data.scatterConfig.scatterSize,
                                callback(d) {
                                    v.data.scatterConfig.scatterSize = parseInt(d);
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "hollow scatter",
                            type: "checkbox",
                            value: {
                                current: v.data.scatterConfig.hollow,
                                callback(d) {
                                    v.data.scatterConfig.hollow = d;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "",
                            ref: "filterSamples",
                            type: "vue",
                            component: "filter-samples-bind",
                            data: {
                                get samples() {
                                    return v.data.scatterData;
                                },
                                get title() {
                                    return "Filter Samples";
                                },
                                callback(samples) {
                                    // console.log(samples);
                                    v.data.scatterData = samples;
                                    run(v);
                                },
                            },
                        },
                    ],
                },
            },
            // scatterConfig(v),
            {
                id: "setting-bc",
                title: "Box content settings",
                layout: "single-page",
                view: {
                    type: "list",
                    items: [                       
                        {
                            title: "Hollow box",
                            type: "checkbox",
                            value: {
                                current: v.data.boxConfig.hollowBox,
                                callback(d) {
                                    v.data.boxConfig.hollowBox = d;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Outliers",
                            type: "checkbox",
                            value: {
                                current: v.data.boxConfig.showOutliers,
                                callback(d) {
                                    v.data.boxConfig.showOutliers = d;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Sample scatter",
                            type: "checkbox",
                            value: {
                                current: v.data.boxConfig.drawScatter,
                                callback(d) {
                                    v.data.boxConfig.drawScatter = d;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Draw violin",
                            type: "checkbox",
                            value: {
                                current: v.data.boxConfig.drawViolin,
                                callback(d) {
                                    v.data.boxConfig.drawViolin = d;
                                    v.data.boxConfig.drawBox = !d;
                                    run(v);
                                },
                            },
                        },
                    ],
                },
            },
            {
                id: "meta",
                title: "Meta Panel",
                layout: "single-page",
                view: {
                    type: "list",
                    items: [
                        {
                            title: "meta info",
                            type: "vue",
                            component: "meta-info",
                            data: {
                                data: v.data.metaFeatures.map(k => ({
                                    name: k, ...v.data.metaInfo[k],
                                })),
                                callback(obj) {
                                    for (const o of obj) {
                                        v.data.metaInfo[o.name].update(v, o);
                                    }
                                    run(v);
                                },
                            },
                        },
                    ]
                }
            }
        ],
    };
}
