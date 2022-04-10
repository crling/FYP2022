import { defaultLayoutConf as conf} from "utils/editor";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import { genDefaultPalette, withDefaultPalette, genPaletteMap} from "oviz-common/palette";

const cbpPalette = {
    cBioPortal: {
        name: "cBioPortal",
        // miss, inframe, trunc, other, text, active layer, line, icon stroke
        colors: ["#3d7f08", "#913810", "#000000", "#c55ebc", "#000000", "#777", "#555", "#fff"],
    },
};

function run(v) {
    v.data._changed = true;
    v.run();
}
export const editorRef = {} as any;

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
                                paletteMap: genPaletteMap(Object.keys(v.data.colors)),
                                callback(colors) {
                                    v.data.colors = colors;
                                    v.forceRedraw = true;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Outliers",
                            type: "checkbox",
                            value: {
                                current: true,
                                callback(value) {
                                    v.data.config.showOutliers = value
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "X-Label Rotation Angle",
                            type: "input",
                            format: "int",
                            value: {
                                current: 45,
                                callback(newValue) {
                                    let val = parseInt(newValue as any);
                                    if (val < 0) val = 0;
                                    if (val > 90) val = 90;
                                    v.data.config.xLabelRotation = val;
                                    run(v);
                                }
                              }
                        },
                    ]
                }
            }
        ],
    };
}
