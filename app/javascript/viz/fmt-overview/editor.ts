// import { showMsgBox } from "packs/vapp";
import { EditorDef, ToolbarDef } from "utils/editor";
import { copyObject } from "utils/object";
// import { filterSpecies, updateCommentColor, updateGensStat } from "./data";
import { filterSpecies, computeSortingScore, generateHistData } from "./data";
import { event } from "crux/dist/utils";

export const editorRef: any = {};

const conf: any = {
    samplesSortBy: ["group"],
};

function updateHistoData(v, idx) {
    for (const h of v.data.data) {
        let counter = 0;
        const rev = [...v.data.histoKeys[idx]].reverse();
        for (const hk of rev) {
            const value = parseFloat(h[hk.rawKey]);
            h._histo[idx][hk.key][0] = counter;
            h._histo[idx][hk.key][1] = counter + value;
            counter += value;
        }
    }
    updateHistoLegendData(v);
}

function updateHistoLegendData(v) {
    v.data.histoLegendData = v.data.histoKeys.map((h, i) => h.map(hk => ({ label: hk.key, fill: v.data.colorScales.histo[i].get(hk.key) })));
}

const samplesVueData: any = {};

let getters = [];
let sortScoreIndex = 0;

function updateSpeciesSorting(v, keys) {
    getters = [];

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
                    getter = s => {
                        if (!!v.data.metaDict[s])
                            return v.data.metaDict[s][key];
                        else
                            return "*";
                    };
                }
        }
        getters.push([getter, sOrder === "a"]);
    }
    getters.push([(s => v.data.speciesSortingScore[s]), false]);
    sortScoreIndex = keys.length;
    v.data.species = sort(v.data, getters);
    filterSpecies(v);
    update(v);
}

function sort(data: any, getters: [any, boolean][]) {
    return data.species.sort((a, b) => {
        let result = 0;
        for (const getter of getters) {
            result = compare(a, b, getter[0], getter[1]);
            if (result !== 0) break;
        }
        return result;
    });
}

function selectGenes(genes: any[], str: string) {
    if (str.length === 0 || str === "0") return genes;

    const result = [];
    for (const s of str.split(",")) {
        const trimmed = s.trim();
        if (trimmed.indexOf("-")) {
            const [start_, end_] = trimmed.split("-").map(x => (x.length ? parseInt(x) : null));
            if (!(start_ === null || start_ > 0)) return null;
            if (!(end_ === null || end_ > 0)) return null;
            const start = start_ === null ? 1 : start_;
            const end = end_ === null ? undefined : end_;
            result.push(...genes.slice(start - 1, end));
        } else {
            const g = genes[parseInt(trimmed) - 1];
            if (!g) return null;
            result.push(g);
        }
    }

    return result;
}

function compare(a: any, b: any, getter: any, asc: boolean) {
    const a_ = getter(a),
        b_ = getter(b);
    // console.log([a_, b_]);
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
export function applyDefaultSpeciesSort(v) {
    getters = [];

    getters.push([(s => v.data.speciesSortingScore[s]), false]);

    getters.push([(s => {
        if (!!v.data.metaDict[s])
            return v.data.metaDict[s]["type"];
        else
            return "*";
    }), true]);

    v.data.species = sort(v.data, getters);
    filterSpecies(v);
}

export function editorConfig(v: any): EditorDef {

    Object.assign(samplesVueData, {
        compact: true,
        needAutoUpdate: true,
        title: "Reorder species manually",
        array: Array.from(v.data.species),
        callback(d) {
            v.data.species = samplesVueData.array = d;
            filterSpecies(v);
            update(v);
        },
    });

    const d = v.data;
    const speciesReorderOpts = [
        ["id", "Species Name"],
        ...d.metaFeatures.map(k => [`mt_${k}`, k, "Meta info"]),
    ]
        .flatMap(([k, name, p]) => [
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
                                // {
                                //     title: "Types",
                                //     type: "select",
                                //     options: v.data.types.map((x, i) => ({value: i, text: x})),
                                //     value: {
                                //         current: 0,
                                //         callback(x) {
                                //             v.data.chosenType = v.data.types[x];
                                //             computeSortingScore(v.data);
                                //             applyDefaultSpeciesSort(v);
                                //             filterSpecies(v);
                                //             editorRef.reorderSample.config.data.array = v.data.hist.samples;
                                //             editorRef.reorderSample.config.data.needAutoUpdate = true;
                                //             editorRef.reorderSample.update();
                                //             update(v);
                                //         },
                                //     },
                                // },
                                {
                                    title: "Bar width",
                                    type: "input",
                                    value: {
                                        current: v.data.gridW,
                                        callback(x) {
                                            v.data.gridW = parseInt(x);
                                            v.data.mainSizeChanged = true;
                                            update(v);
                                        },
                                    },
                                },
                                {
                                    title: "Strain plot height",
                                    type: "input",
                                    value: {
                                        current: v.data.plotHeight,
                                        callback(x) {
                                            v.data.plotHeight = parseInt(x);
                                            update(v);
                                        },
                                    },
                                },
                                {
                                    title: "Label rotation angle",
                                    type: "text",
                                    content: "Valid range: [-90, -45] or [45, 90]",
                                },
                                {
                                    title: null,
                                    type: "input",
                                    value: {
                                        current: v.data.labelAngle,
                                        callback(x) {
                                            const angle = parseInt(x);
                                            if ((-90 <= angle && angle <= -45) || (45 <= angle && angle <= 90))
                                                v.data.labelAngle = angle;
                                            update(v);
                                        },
                                    },
                                },
                                {
                                    type: "checkbox",
                                    title: "Italic label",
                                    value: {
                                        get current() {
                                            return v.data.italicLabel;
                                        },
                                        callback(value) {
                                            v.data.italicLabel = value;
                                            update(v);
                                        },
                                    },
                                },
                                {
                                    title: "Reorder sample",
                                    type: "vue",
                                    component: "reorder",
                                    ref: "reorderSample",
                                    data: {
                                        title: `Reorder sample`,
                                        array: v.data.samples,
                                        callback(array) {
                                            v.data.samples = array;
                                            computeSortingScore(v.data);
                                            getters[sortScoreIndex] = [(s => v.data.speciesSortingScore[s]), false];
                                            v.data.species = sort(v.data, getters);
                                            filterSpecies(v);
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
                        id: "g-species",
                        name: "Species",
                        view: {
                            type: "list",
                            items: [
                                {
                                    title: "Reorder samples by",
                                    type: "vue",
                                    component: "reorder-species",
                                    data: {
                                        options: speciesReorderOpts,
                                        keys: Array.from(conf.samplesSortBy),
                                        // mutTypes: Array.from(v.data.mutTypes),
                                        callback: (s, useDefault) => {
                                            if (useDefault) {
                                                applyDefaultSpeciesSort(v);
                                                update(v);
                                            } else updateSpeciesSorting(v, s);
                                        },
                                    },
                                },
                                {
                                    type: "vue",
                                    component: "reorder",
                                    title: "Reorder species manually",
                                    data: samplesVueData,
                                },
                                {
                                    type: "vue",
                                    component: "filter-samples",
                                    title: "Filter Species",
                                    ref: "filterSpecies",
                                    data: {
                                        get samples() {
                                            return Array.from(v.data.species);
                                        },
                                        get defaultValue() {
                                            return true;
                                        },
                                        get title() {
                                            return "Filter Species";
                                        },
                                        callback(_, hiddenSamples) {
                                            v.data.hiddenSpecies = new Set(hiddenSamples);
                                            filterSpecies(v);
                                            v.data.mainSizeChanged = true;
                                            update(v);
                                        },
                                    },
                                },
                                {
                                    type: "vue",
                                    component: "filter-samples",
                                    title: "Highlight Species",
                                    ref: "highlightSpecies",
                                    data: {
                                        get samples() {
                                            return Array.from(v.data.species);
                                        },
                                        get defaultValue() {
                                            return false;
                                        },
                                        get title() {
                                            return "Highlight Species";
                                        },
                                        callback(highlight, _) {
                                            v.data.highlightSpecies = new Set(highlight);
                                            update(v);
                                        },
                                    },
                                },
                                {
                                    type: "button",
                                    title: "Show ordered species list",
                                    action() {
                                        const hidden = v.data.hiddenSpecies;
                                        event.emit("show-msgbox", {title: "Species List", 
                                            content: v.data.species.map(s => (hidden.has(s) ? `${s} (hidden)` : s)).join("<br>"),
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
                                    for (const o of obj) {
                                        v.data.metaInfo[o.name].update(v, o);
                                    }
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

function histoPanelDef(v: any, h: any, i: number) {
    return {
        id: `histo-${i}`,
        title: `Histogram ${h[0].name}`,
        layout: "tabs",
        tabs: [
            {
                id: `h-settings-${i}`,
                name: "Settings",
                view: {
                    type: "list",
                    items: [
                        {
                            title: "Name",
                            type: "input",
                            bind: {
                                object: conf,
                                path: `histoName.#${i}`,
                                callback() {
                                    v.data.histoName[i] = conf.histoName[i];
                                    update(v);
                                },
                            },
                        },
                        {
                            title: "Hidden",
                            type: "checkbox",
                            bind: {
                                object: conf,
                                path: `histoHidden.#${i}`,
                                callback() {
                                    v.data.histoHidden[i] = conf.histoHidden[i];
                                    update(v);
                                },
                            },
                        },
                        {
                            title: "Display sample labels",
                            type: "checkbox",
                            bind: {
                                object: conf,
                                path: `displaySampleLabel.#${i}`,
                                callback() {
                                    v.data.displaySampleLabel[i] = conf.displaySampleLabel[i];
                                    update(v);
                                },
                            },
                        },
                        {
                            title: "Max value for Y axis",
                            type: "input",
                            format: "float",
                            bind: {
                                object: conf,
                                path: `histoMaxValue.#${i}`,
                                callback() {
                                    v.data.histoMaxValue[i] = parseInt(conf.histoMaxValue[i]);
                                    update(v);
                                },
                            },
                        },
                        {
                            title: "Y axis label",
                            type: "input",
                            bind: {
                                object: conf,
                                path: `histoLabel.#${i}`,
                                callback() {
                                    v.data.histoLabel[i] = conf.histoLabel[i];
                                    update(v);
                                },
                            },
                        },
                    ],
                },
            },
            {
                name: "Data",
                id: `h-data-${i}`,
                view: {
                    type: "list",
                    items: [
                        {
                            type: "vue",
                            component: "reorder",
                            data: {
                                title: "Reorder groups in histogram",
                                array: v.data.histoKeys[i].map(h => h.key),
                                callback(array) {
                                    v.data.histoKeys[i] = array.map(x => v.data.histoKeys[i].find(h => h.key === x));
                                    updateHistoData(v, i);
                                    update(v);
                                },
                            },
                        },
                        {
                            type: "vue",
                            component: "color-picker",
                            data: {
                                title: "Customize colors",
                                scheme: copyObject(v.data.colorScales.histo[i].colors),
                                id: "histo",
                                callback(colors) {
                                    v.data.colorScales.histo[i].colors = colors;
                                    updateHistoLegendData(v);
                                    update(v);
                                },
                            },
                        },
                    ],
                },
            },
        ],
    };
}
export const toolbar: ToolbarDef = [];
