import { EditorDef } from "utils/editor";
import { getLinkColor, main, updateBranchZIndex } from "./data";

export const editorRef: any = {};

export const conf = {
    min: 0.00,
    treeDepth: 0,
    level: 7,
    nameOption: 2,
    isRadical: false,
    displayCircularTree: false,
    distinctNodeOnly: false,
    depthSelectOption: [
        { value: "0", text: "Root"},
        { value: "1", text: "Kingdom"},
        { value: "2", text: "Phylum"},
        { value: "3", text: "Class"},
        { value: "4", text: "Order"},
        // { value: "5", text: "Family"},
        // { value: "6", text: "Genus"},
    ],
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
                            options: conf.depthSelectOption,
                            bind: {
                                object: conf,
                                path: "treeDepth",
                                callback() {
                                    v.data.tree.dataOpt.treeDepth = parseInt(conf.treeDepth);
                                    v.data.tree.library.color_dict = getLinkColor(v.data.tree.allNodes, v.data.tree.dataOpt.treeDepth);
                                    v.run();
                                },
                            },
                        },
                        {
                            title: "Leaves Level",
                            type: "select",
                            ref: "levelSelect",
                            options: [
                                { value: "1", text: "Kingdom"},
                                { value: "2", text: "Phylum"},
                                { value: "3", text: "Class"},
                                { value: "4", text: "Order"},
                                { value: "5", text: "Family"},
                                { value: "6", text: "Genus"},
                                { value: "7", text: "Species"},
                            ],
                            bind: {
                                object: conf,
                                path: "level",
                                callback() {
                                    v.data.tree.dataOpt.level = parseInt(conf.level);

                                    editorRef.depthSelect.config.options = conf.depthSelectOption.slice(0, v.data.tree.dataOpt.level);
                                    if (parseInt(conf.treeDepth) >= parseInt(conf.level)) {
                                        editorRef.depthSelect.value = parseInt(conf.level) - 1;
                                    }

                                    v.data.tree.dataOpt.maxTextLength = 0;
                                    v.data.tree = main(v.data.tree._data);
                                    // updateBranchZIndex(v);
                                    if (v.data.tree.leaves.length < 20) {
                                        v.data.tree.dataOpt.isRadical = conf.displayCircularTree;
                                        editorRef.circularChecked.config.disabled = false;
                                    } else {
                                        v.data.tree.dataOpt.isRadical = true;
                                        editorRef.circularChecked.value = true;
                                        editorRef.circularChecked.config.disabled = true;
                                    }

                                    v.run();
                                },
                            },
                        },
                        {
                            title: "Name Display",
                            type: "select",
                            ref: "showNameSelect",
                            disabled: conf.distinctNodeOnly,
                            options: [
                                { value: "1", text: "Show All Name"},
                                { value: "2", text: "Highlight Distinct Name"},
                                { value: "3", text: "Show No Name"},
                            ],
                            bind: {
                                object: conf,
                                path: "nameOption",
                                callback() {
                                    switch (parseInt(conf.nameOption)) {
                                        case 1:
                                            v.data.tree.dataOpt.showAllNodeName = true;
                                            v.data.tree.dataOpt.showDistinctNodeName = false;
                                            break;
                                        case 2:
                                            v.data.tree.dataOpt.showAllNodeName = true;
                                            v.data.tree.dataOpt.showDistinctNodeName = true;
                                            break;
                                        case 3:
                                            v.data.tree.dataOpt.showAllNodeName = false;
                                            v.data.tree.dataOpt.showDistinctNodeName = false;
                                            break;
                                    }
                                    v.run();
                                },
                            },
                        },
                        {
                            title: "Show Distinct Node Only",
                            type: "checkbox",
                            ref: "distinctNodeOnly",
                            bind: {
                                object: conf,
                                path: "distinctNodeOnly",
                                callback() {
                                    v.data.tree.dataOpt.distinctNodeOnly = conf.distinctNodeOnly;
                                    v.data.tree = main(v.data.tree._data);
                                    // updateBranchZIndex(v);

                                    if (conf.distinctNodeOnly) {
                                        editorRef.showNameSelect.value = 2;
                                        editorRef.showNameSelect.config.disabled = true;
                                    } else {
                                        editorRef.showNameSelect.value = 2;
                                        editorRef.showNameSelect.config.disabled = false;
                                    }

                                    if (v.data.tree.leaves.length < 20) {
                                        v.data.tree.dataOpt.isRadical = conf.displayCircularTree;
                                        editorRef.circularChecked.config.disabled = false;
                                    } else {
                                        v.data.tree.dataOpt.isRadical = true;
                                        editorRef.circularChecked.value = true;
                                        editorRef.circularChecked.config.disabled = true;
                                    }

                                    v.run();
                                },
                            },
                        },
                        {
                            title: "Display Radical Tree",
                            type: "checkbox",
                            ref: "circularChecked",
                            disabled: conf.isRadical,
                            bind: {
                                object: conf,
                                path: "displayCircularTree",
                                callback() {
                                    if (v.data.tree.leaves.length < 20) {
                                        v.data.tree.dataOpt.isRadical = conf.displayCircularTree;
                                    } else {
                                        this.config.disabled = true;
                                    }
                                    v.run();
                                },
                            },
                        },
                        {
                            title: `Q Value (0 - 0.5)`,
                            type: "input",
                            format: "float",
                            get value() {
                                return {
                                    current: parseFloat(v.data.tree.dataOpt.maxQvalue),
                                    callback(val) {
                                        if (val < 0 || val > 0.5) {
                                            window.alert
                                            (`Invalid value. The value should stay positive and not exceed 0.5.`);
                                            this.value = conf.min;
                                        } else {
                                            v.data.tree.dataOpt.maxQvalue = val;
                                            v.data.tree = main(v.data.tree._data);
                                            // updateBranchZIndex(v);
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
