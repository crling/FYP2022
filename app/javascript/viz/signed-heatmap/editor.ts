import {defaultLayoutConf as conf} from "utils/editor"
import { genDefaultPalette, withDefaultPalette } from "oviz-common/palette";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";

function run(v) {
    v.data._changed = true;
    v.run();
}
export const editorRef = {} as any;

const cbpPalette = {
    cBioPortal: {
        name: "cBioPortal",
        // miss, inframe, trunc, other, text, active layer, line, icon stroke
        colors: ["#3d7f08", "#913810", "#000000", "#c55ebc", "#000000", "#777", "#555", "#fff"],
    },
};

export function editorConfig(v): EditorDef {
    const [defaultPalette] = genDefaultPalette(v.data.colors);
    return {
        sections: [
            {
                id: "settings",
                title: "Settings",
                layout: "single-page",
                view: {
                    type: "list",
                    items: [
                        {
                            type: "vue",
                            title: "",
                            component: "color-picker",
                            data: {
                                title: "Customize colors",
                                scheme: copyObject(v.data.colors),
                                palettes: withDefaultPalette(defaultPalette, cbpPalette),
                                id: "pwcolor",
                                callback(colors) {
                                    v.data.colors = colors;
                                    v.forceRedraw = true;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "P Annotation",
                            type: "checkbox",
                            bind: {
                                object: conf,
                                path: "showPAnno",
                                callback() {
                                    v.data.config.showPAnno = conf.showPAnno;
                                    run(v);
                                },
                            },
                            value: {
                                current: true,
                                callback() {},
                            },
                        },
                        {
                            title: "Symmetry Color Range",
                            type: "checkbox",
                            bind: {
                                object: conf,
                                path: "isSym",
                                callback() {
                                    v.data.config.isSym = conf.isSym;
                                    run(v);
                                },
                            },
                            value: {
                                current: true,
                                callback() {},
                            },
                        },
                        {
                            title: "Range Upper Bound",
                            type: "input",
                            bind: {
                                object: conf,
                                path: "max",
                                callback() {
                                    v.data.config.rangeMax = conf.max;
                                    run(v);
                                },
                            },
                            value: {
                                current: v.data.config.rangeMax,
                                callback() {},
                            },
                        },
                        {
                            title: "Range Lower Bound",
                            type: "input",
                            bind: {
                                object: conf,
                                path: "min",
                                callback() {
                                    v.data.config.rangeMin = conf.min;
                                    run(v);
                                },
                            },
                            value: {
                                current: v.data.config.rangeMin,
                                callback() {},
                            },
                        },
                    ],
                },
            },
        ],
    };
}
