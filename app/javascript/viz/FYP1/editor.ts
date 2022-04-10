import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import { filteredMethod } from "./index";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

//在editor下添加功能模块
//一些单选多选
export const generateTestConfig = (v): any => (            {
    id: "setting-bc",
    title: "test content settings",
    layout: "single-page",
    view: {
        type: "list",
        //添加项目
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
                        v.data.colors = colors;
                        run(v);
                    },
                },
            },
        ],
    },
});

//生成对应的配置文件
//与index.ts连接
export function editorConfig(v): EditorDef {
    return {
        sections: [
            {
                id: "data",
                title: "edit Data",
                layout: "tabs",
                tabs: [
                    {
                        id: "gData",
                        name: "General",
                        view: {
                            type: "list",
                            items: [
                            {
                                title: "Range Lower Bound",
                                type: "input",
                                ref: "lowerBound",
                                value: {
                                    //current: v.data.data.valueRange[0],
                                    current: v.data.valueRange[0],
                                    callback(d) {
                                        v.data.valueRange[0] = parseFloat(d);
                                        run(v);
                                    },
                                },
                            },
                            {
                                title: "Range Upper Bound",
                                type: "input",
                                ref: "upperBound",
                                value: {
                                    current: v.data.valueRange[1],
                                    callback(d) {
                                        v.data.valueRange[1] = parseFloat(d);
                                        run(v);
                                    },
                                },
                            },            
                            ],
                        },
                    },
                ],
            },
            {
                id: "general",
                title: "Choose Method",
                layout: "single-page",
                view: {
                    type:"list",
                    items:[
                        {
                            type:"vue",
                            component: "filter-samples",
                            title:null,
                            ref:"highlightSpecies",
                            data:{
                                get samples() {
                                    return Array.from(v.data.methoddata);
                                },
                                get defaultValue() {
                                    return false;
                                },
                                get title() {
                                    return "Choose Method";
                                },
                                callback(choosesmethod) {
                                    v.data.chosenMethod = new Set(choosesmethod);
                                    console.log("v.data.chosenMethod:",v.data.chosenMethod)
                                    filteredMethod(v);
                                    v.root._sizeUpdated = true;
                                    run(v);
                                },
                            }

                        },
                    ]    
                }
            },
            //generateGridConfig(v),
            generateTestConfig(v),
        ],
    };
}
