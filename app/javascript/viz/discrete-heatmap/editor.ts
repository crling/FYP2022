import {defaultLayoutConf as conf} from "utils/editor"
import { genDefaultPalette, withDefaultPalette } from "oviz-common/palette";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";

function run(v) {
    v.data._changed = true;
    v.run();
}
export const editorRef = {} as any;

function genPaltteeMapForArray(values) {
    const map = {};
    values.forEach((v, i)=> map[`data${v}`] = i);
    return map;
}
function convertColorsMapToArray(colorMap) {
    const colors = [];
    Object.keys(colorMap).forEach(k=> colors.push(colorMap[k]));
    return colors;
}
export function editorConfig(v):EditorDef {
    const [defaultPalette] = genDefaultPalette(v.data.colors, v.data.values);
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
                                //names: genPaltteeMapForArray(v.data.values),
                                palettes: withDefaultPalette(defaultPalette),
                                paletteMap: genPaltteeMapForArray(v.data.values),
                                id: "pwcolor",
                                callback(colors) {
                                    v.data.colors = convertColorsMapToArray(colors);
                                    v.forceRedraw = true;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Column Label Rotation Angle",
                            type: "input",
                            format: "int",
                            value: {
                                current: 90,
                                callback(newValue) {
                                    let val = parseInt(newValue as any);
                                    if (val < 0) val = 0;
                                    if (val > 90) val = 90;
                                    v.data.config.colLabelRotation = val;
                                    run(v);
                                }
                              }
                        },
                    ],
                },
            },
        ],
    };
}

export function defaultEditorConfig(v):EditorDef {
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
                            title: "Default",
                            type: "input",
                            format: "int",
                            value: {
                                current: 0,
                                callback(newValue) {
                                    let val = parseInt(newValue as any);
                                    if (val < 0) val = 0;
                                    if (val > 90) val = 90;
                                    v.data.config.colLabelRotation = val;
                                    run(v);
                                }
                              }
                        },
                    ],
                },
            },
        ],
    };
}