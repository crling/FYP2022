import { EditorDef } from "utils/editor";
import {convert, getLinkColor, getTreeSetUp, treeLoaded} from "./data";

export const editorRef: any = {};

export const conf = {
    min: 0.00,
    treeDepth: 0,
    isRadical: false,
    displayCircularTree: false,
} as any;

export function editorConfig(v: any): EditorDef {

    conf.treeDepth = v.data.tree.dataOpt.treeDepth;
    conf.displayCircularTree = v.data.tree.dataOpt.isRadical;
    conf.isRadical = v.data.tree.dataOpt.isRadical;
    conf.min = v.data.tree.dataOpt.min;

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
                            title: "Classification Rank",
                            type: "select",
                            ref: "depthSelect",
                            options: [
                                { value: "0", text: "Root"},
                                { value: "1", text: "Domain"},
                                { value: "2", text: "Kingdom"},
                                { value: "3", text: "Phylum"},
                                { value: "4", text: "Class"},
                                { value: "5", text: "Order"},
                                { value: "6", text: "Family"},
                                { value: "7", text: "Genus"},
                            ],
                            bind: {
                                object: conf,
                                path: "treeDepth",
                                callback() {
                                    v.data.tree.dataOpt.treeDepth = parseInt(conf.treeDepth);
                                    v.data.tree.dataOpt.classficationRank = convert(8 - v.data.tree.dataOpt.treeDepth);
                                    const temp = getLinkColor(v.data.tree.allNodes);
                                    v.data.tree.colorNodes = temp.colorNodes;
                                    v.data.tree.depthNodesLegend = temp.depthNodesLegend;
                                    v.data.tree.depthPathNodes = temp.depthPathNodes;
                                    v.run();
                                },
                            },
                        },
                        {
                            title: "Display Circular Tree",
                            type: "checkbox",
                            ref: "circularChecked",
                            disabled: conf.isRadical,
                            bind: {
                                object: conf,
                                path: "displayCircularTree",
                                callback() {
                                    if (v.data.tree.leaves.length < 30) {
                                        v.data.tree.dataOpt.isRadical = conf.displayCircularTree;
                                        getTreeSetUp(conf.displayCircularTree, v.data.tree.leaves.length);
                                    } else {
                                        this.config.disabled = true;
                                    }
                                    v.run();
                                },
                            },
                        },
                        {
                            title: `Minimum Abundance (0% - ${ (parseFloat(v.data.tree.dataOpt.Abundance) - 0.01).toFixed(2)  } %)`,
                            type: "input",
                            format: "float",
                            get value() {
                                return {
                                    current: parseFloat(v.data.tree.dataOpt.min),
                                    callback(val) {
                                        if (val < 0 || val > v.data.tree.dataOpt.Abundance) {
                                            window.alert
                                            (`Invalid value. The value should stay positive and not exceed ${v.data.tree.dataOpt.Abundance}.`);
                                            this.value = conf.min;
                                        } else {
                                            v.data.tree.dataOpt.min = val;
                                            const newTree = treeLoaded(v.data.tree._data);
                                            if (newTree.leaves.length < 30) {
                                                v.data.tree.dataOpt.isRadical = conf.displayCircularTree;
                                                editorRef.circularChecked.config.disabled = false;
                                            } else {
                                                v.data.tree.dataOpt.isRadical = true;
                                                editorRef.circularChecked.value = true;
                                                editorRef.circularChecked.config.disabled = true;
                                            }
                                            v.data.tree = newTree;
                                        }
                                        v.run();
                                    },
                                };
                            },
                        },
                    ],
                },
            },
        ],
    };
}
