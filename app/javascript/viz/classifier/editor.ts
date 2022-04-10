import { genDefaultPalette, withDefaultPalette } from "oviz-common/palette";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";

function run(v) {
    v.forceDraw = true;
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
                            type: "vue",
                            title: "",
                            component: "color-picker",
                            data: {
                                title: "Customize colors",
                                scheme: copyObject(v.data.colors),
                                id: "pwcolor",
                                callback(colors) {
                                    v.data.colors = {...colors};
                                    run(v);
                                },
                            },
                        },
                    ],
                },
            },
        ],
    };
}
