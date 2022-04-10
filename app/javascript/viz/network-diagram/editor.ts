import { defaultLayoutConf as conf} from "utils/editor";
import { EditorDef } from "utils/editor";

function run(v) {
    v.data._changed = true;
    v.run();
}
export const editorRef = {} as any;

export function editorConfig(v): EditorDef {
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
                            title: "Node Name",
                            type: "checkbox",
                            bind: {
                                object: conf,
                                path: "showNodeNames",
                                callback() {
                                    v.data.config.showNodeNames = conf.showNodeNames;
                                    run(v);
                                },
                            },
                        },
                        // {
                        //     title: "",
                        //     type: "vue",
                        //     component: "color-picker",
                        //     data: {
                        //         title: "Color Palette",
                        //         scheme: ,
                        //         palettes: withDefaultPalette(defaultPalette, cbpPalette),
                        //         paletteMap,
                        //         id: "pwcolor",
                        //         callback(colors) {
                        //             v.data.colors = colors;
                        //             v.forceRedraw = true;
                        //             run(v);
                        //         },
                        //     }
                        // }
                    ]
                }
            }
        ],
    };
}
