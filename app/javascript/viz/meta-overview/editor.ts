import { event } from "crux/dist/utils";
import { EditorDef, ToolbarDef } from "utils/editor";
import { filterSamples } from "./data";

export const editorRef: any = {};

const conf: any = {
    sampleSortBy: ["age"],
};

function updateSampleSorting(v, keys) {
    const getters = [];

    for (const sampleSortBy of keys) {
        const sOrder = sampleSortBy[0];
        const sKey = sampleSortBy.substr(1);

        let getter: any;
        switch (sKey) {
            case "id":
                getter = s => s;
                break;
            default:
                const s = sKey.indexOf("_");
                // const panel = sKey.substr(0, s);
                const key = sKey.substr(s + 1);
                if (key === "age" || key === "BMI") {
                    getter = s => Number.isNaN(v.data.metaDict[s][key]) ? Number.MAX_VALUE : v.data.metaDict[s][key];
                } else {
                    getter = s => v.data.metaDict[s][key];
                }
        }
        getters.push([getter, sOrder === "a"]);
    }
    v.data.samples = sort(v.data, getters);
    filterSamples(v);
    update(v);
}
function sort(data: any, getters: [any, boolean][]) {
    return data.samples.sort((a, b) => {
        let result = 0;
        for (const getter of getters) {
            result = compare(a, b, getter[0], getter[1]);
            if (result !== 0) break;
        }
        return result;
    });
}

function compare(a: any, b: any, getter: any, asc: boolean) {
    const a_ = getter(a),
        b_ = getter(b);
    const va = asc ? a_ : b_;
    const vb = asc ? b_ : a_;
    if (va < vb) return -1;
    else if (va > vb) return 1;
    else return 0;
}

function update(v) {
    v.forceRedraw = true;
    v.run();
}

export function editorConfig(v: any): EditorDef {

    const d = v.data;
    const sampleReorderOpts = [
        ["id", "Sample ID"],
        ...d.metaFeatures.map(k => [`mt_${k}`, k, "Meta info"]),
    ].flatMap(([k, name, p]) => [
            { value: `a${k}`, text: `${p ? `${p}: ` : ""}${name} ↑` },
            { value: `d${k}`, text: `${p ? `${p}: ` : ""}${name} ↓` },
        ]);

    return {
        sections: [
            {
                id: "general",
                title: "General",
                layout: "tabs",
                tabs: [
                    {
                        id: "g-common",
                        name: "Common",
                        view: {
                            type: "list",
                            items: [
                                {
                                    title: "Grid width",
                                    type: "input",
                                    format: "int",
                                    value: {
                                        current: v.data.gridSize[0],
                                        callback(x) {
                                            v.data.gridSize[0] = parseFloat(x);
                                            v.data._sizeUpdated = true;
                                            update(v);
                                        },
                                    },
                                },
                                {
                                    title: "Grid height",
                                    type: "input",
                                    format: "int",
                                    value: {
                                        current: v.data.gridSize[1],
                                        callback(x) {
                                            v.data.gridSize[1] = parseFloat(x);
                                            v.data._sizeUpdated = true;
                                            update(v);
                                        },
                                    },
                                },
                                // {
                                //     type: "vue",
                                //     component: "color-picker",
                                //     ref: "naColorPicker",
                                //     data: {
                                //         title: "Color for N/A",
                                //         scheme: {},
                                //         naColor: v.data.NAColor,
                                //         id: "group",
                                //         callback(_, naColor) {
                                //             v.data.NAColor = naColor;
                                //             update(v);
                                //         },
                                //     },
                                // },
                            ],
                        },
                    },
                    {
                        id: "g-sample",
                        name: "Samples",
                        view: {
                            type: "list",
                            items: [
                                {
                                    title: "Reorder samples by",
                                    type: "vue",
                                    component: "reorder-sample",
                                    data: {
                                        options: sampleReorderOpts,
                                        keys: Array.from(conf.sampleSortBy),
                                        // mutTypes: Array.from(v.data.mutTypes),
                                        callback: (s, neg, pos, g, sortPos, sortNeg) => {
                                            updateSampleSorting(v, s);
                                        },
                                    },
                                },
                                // {
                                //     type: "vue",
                                //     component: "reorder",
                                //     title: "Reorder samples",
                                //     data: samplesVueData,
                                // },
                                {
                                    type: "vue",
                                    component: "filter-samples",
                                    title: null,
                                    ref: "filterSample",
                                    data: {
                                        get samples() {
                                            return Array.from(v.data.samples);
                                        },
                                        get defaultValue() {
                                            return true;
                                        },
                                        get title() {
                                            return "Filter Samples";
                                        },
                                        callback(hiddenSamples) {
                                            v.data.hiddenSamples = new Set(hiddenSamples);
                                            filterSamples(v);
                                            v.root._sizeUpdated = true;
                                            update(v);
                                        },
                                    },
                                },
                                {
                                    type: "button",
                                    title: "Show ordered sample list",
                                    action() {
                                        const hidden = v.data.hiddenSamples;
                                        event.emit("show-msgbox", {title:"Sample List", 
                                            content: v.data.samples.map(s => (hidden.has(s) ? `${s} (hidden)` : s)).join("<br>"),
                                            html: true});
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
            {
                id: "meta",
                title: "Meta Panel",
                layout: "tabs",
                tabs: [
                    {
                        name: "Settings",
                        id: "content",
                        view: {
                            type: "vue",
                            component: "meta-info",
                            data: {
                                data: v.data.metaFeatures.map(k => ({
                                    name: k, ...v.data.metaInfo[k],
                                })),
                                callback(obj) {
                                    // console.log(Object.keys(v.data.metaInfo));
                                    for (const o of obj) {
                                        v.data.metaInfo[o.name].update(v, o);
                                    }
                                    // console.log(v.data.metaInfo);
                                    update(v);
                                },
                            },
                        },
                    },
                    {
                        name: "Reorder",
                        id: "reorder",
                        view: {
                            type: "vue",
                            component: "reorder",
                            data: {
                                title: `Reorder meta features`,
                                array:  v.data.metaFeatures,
                                callback(array) {
                                    v.data.metaFeatures = array;
                                    update(v);
                                },
                            },
                        },
                    },
                ],
            },
        ],
    };
}

export const toolbar: ToolbarDef = [];
