import Oviz from "crux";
import { parseNewick } from "crux/dist/utils";
import * as text_size from "crux/dist/utils/text-size";
import * as d3 from "d3-hierarchy";

const groupColors = ["#908CA8",
"#D49C98",
"#EBCFB9",
"#BA93A1",
"#687B9F",
"#8A7F89",
"#A08279",
"#B5AEB3",
"#A97D61",
"#826C94"];

const rainbow = [ "hsl(340, 82%, 76%)",
"hsl(0, 73%, 77%)",
"hsl(14, 100%, 78%)",
"hsl(36, 100%, 75%)",
"hsl(45, 100%, 75%)",
"hsl(54, 90%, 72%)", // "hsl(54, 100%, 81%)",
"hsl(66, 71%, 77%)",
"hsl(88, 50%, 76%)",
"hsl(122, 37%, 74%)",
"hsl(174, 42%, 65%)",
"hsl(187, 72%, 71%)",
"hsl(199, 82%, 74%)",
"hsl(212, 90%, 74%)",
"hsl(231, 44%, 74%)",
"hsl(261, 46%, 74%)",
"hsl(291, 47%, 71%)",
];

export let dataOpt = {
    allLevel: ["r", "k", "p", "c", "o", "f", "g", "s"],
    allRank: ["Root", "Kingdom", "Phylum", "Class", "Order", "Family", "Genus", "Species"],
    level : 7,
    treeDepth: 4,
    maxTextLength: 0,
    treeRadius: 350,
    treeLeafSize: 20,
    treeHeight: 0,
    boxLegend: 8,
    isRadical: false,
    maxQvalue: 0.05,
    distinctNodeOnly: false,
    showDistinctNodeName: true,
    showAllNodeName: true,
    boxPlotLength: 600,
    logPara: 0.01,
};

export let library = {
    s_dict: [],
    id_group: {
        dict: [],
        group1: "",
        group2: "",
    },
    matrix_dict: [],
    color_dict: {},
};

function Node(name) {

    this.Name = name;
    this.children = [];
    this.next = null;
    this.parent = null;

    this.addChild = function addChild(node) {
        this.children.push(node);
    };

}

function Tree(root) {

    this.root = new Node(root);
    this.allNode = [];
    this.allNode["r__Root"] = this.root;

    this.add = function addNode(node) {
        this.allNode[node.Name] = node;
    };
}

function normalize(num: number, max_origin: number, min_origin: number) {
    return ( ( Math.log2(num) - Math.log2(min_origin) ) / ( Math.log2(max_origin) - Math.log2(min_origin) ) * dataOpt.boxPlotLength);
    // return ( ( num - min_origin ) / ( max_origin - min_origin ) * dataOpt.boxPlotLength);
}

function boxPlotValue(group_data, max_origin: number, min_origin: number) {
    const statics_origin = new Oviz.algo.Statistics(group_data);
    const interQuartileRange = statics_origin.Q3() - statics_origin.Q1();
    const outliners = [];
    const inliners = [];
    group_data.forEach(d => {
        if ((d < statics_origin.Q1() - 1.5 * interQuartileRange) || (d > statics_origin.Q3() + 1.5 * interQuartileRange)) {
            outliners.push(normalize(d + dataOpt.logPara, max_origin, min_origin));
        } else {
            inliners.push(d);
        }
    });
    const statics = new Oviz.algo.Statistics(inliners);
    const max = normalize(statics.max() + dataOpt.logPara, max_origin, min_origin);
    const min = normalize(statics.min() + dataOpt.logPara, max_origin, min_origin);
    const q1 = normalize(statics.Q1() + dataOpt.logPara, max_origin, min_origin);
    const q3 = normalize(statics.Q3() + dataOpt.logPara, max_origin, min_origin);
    const mean = normalize(statics.mean() + dataOpt.logPara, max_origin, min_origin);
    const median = normalize(statics.median() + dataOpt.logPara, max_origin, min_origin);
    return {
        max: max,
        min: min,
        q1: q1,
        q3: q3,
        mean: mean,
        median: median,
        outliners: outliners,
        length: inliners.length,
    };
}

export function loadAnnoData(data) {

    const id_group = {
        dict: [],
        group1: "",
        group2: "",
    };

    data.forEach(d => {
        id_group.dict[d.ID] = d.Group;
        if (id_group.group1 === "") {
            id_group.group1 = d.Group;
        } else if (id_group.group2 === "" && id_group.group1 !== d.Group) {
            id_group.group2 = d.Group;
        }
    });

    return id_group;
}

export function annoLoaded(_data) {
    library.id_group = loadAnnoData(_data);
    return _data;
}

export function loadMatrixData(_data) {

    const enriched = _data.columns[9];
    const qvalue = _data.columns[11];
    const occ_rate_group1 = (_data.columns[4].substring(9) === library.id_group.group1 + ")") ? _data.columns[4] : _data.columns[8];
    const mean_group1 = (_data.columns[1].substring(5) === library.id_group.group1 + ")") ? _data.columns[1] : _data.columns[5];
    const occ_rate_group2 = (_data.columns[4].substring(9) === library.id_group.group2 + ")") ? _data.columns[4] : _data.columns[8];
    const mean_group2 = (_data.columns[1].substring(5) === library.id_group.group2 + ")") ? _data.columns[1] : _data.columns[5];

    const matrix_dict = [];

    matrix_dict["r__Root"] = {
        enriched: "N/A",
        qvalue: "N/A",
        mean_group1: 0.0,
        mean_group2: 0.0,
    };

    _data.forEach(d => {

        const is_valid_group1 = (parseFloat(d[occ_rate_group1]) > 0.2 && parseFloat(d[mean_group1]) > 0.05);
        const is_valid_group2 = (parseFloat(d[occ_rate_group2]) > 0.2 && parseFloat(d[mean_group2]) > 0.05);
        const isValid = is_valid_group1 || is_valid_group2;

        if (isValid) {
            matrix_dict[d.ID] = {
                enriched: d[enriched],
                qvalue: parseFloat(d[qvalue]),
                mean_group1: parseFloat(d[mean_group1]),
                mean_group2: parseFloat(d[mean_group2]),
            };
        }

    });
    return matrix_dict;
}

export function matrixLoaded(_data) {

    library.matrix_dict = loadMatrixData(_data);

    return _data;
}

export function getLinkColor(nodes, treeDepth) {

    const depthNodes = nodes.filter(d => d.depth === treeDepth);

    const len = depthNodes.length;

    const color = Oviz.color.ColorSchemeCategory.create(len);

    const depthNodesLegend = [];
    const colorNodes = [];
    const colorLinks = [];
    const depthPathNodes = [];

    const nodeColor = (hslString: string) => {
        const attrs = hslString.split("(")[1].substring(0, hslString.length - 1);
        const h = parseFloat(attrs.split(",")[0]);
        const s = parseInt(attrs.split(",")[1].substring(0, hslString.length - 1)) - 10;
        const l = parseInt(attrs.split(",")[2].substring(0, hslString.length - 1)) + 20;
        return `hsl(${h},${s}%,${l}%)`;
        // return hslString;
    };

    const linkColor = (hslString: string) => {
        const attrs = hslString.split("(")[1].substring(0, hslString.length - 1);
        const h = parseFloat(attrs.split(",")[0]);
        const s = parseInt(attrs.split(",")[1].substring(0, hslString.length - 1)) + 30;
        const l = parseInt(attrs.split(",")[2].substring(0, hslString.length - 1)) - 20;
        return `hsl(${h},${s}%,${l}%)`;
    };

    const dark30 = (hslString: string) => {
        const attrs = hslString.split("(")[1].substring(0, hslString.length - 1);
        const h = parseFloat(attrs.split(",")[0]);
        const s = parseInt(attrs.split(",")[1]);
        const l = parseInt(attrs.split(",")[2].substring(0, hslString.length - 1)) - 30;
        return `hsl(${h},${s}%,${l}%)`;
    };
    const dark50 = (hslString: string) => {
        const attrs = hslString.split("(")[1].substring(0, hslString.length - 1);
        const h = parseFloat(attrs.split(",")[0]);
        const s = parseInt(attrs.split(",")[1]);
        const l = parseInt(attrs.split(",")[2].substring(0, hslString.length - 1)) - 40;
        return `hsl(${h},${s}%,${l}%)`;
    };

    const getColors = (n: number) => {
        const div = Math.floor(rainbow.length / n);
        const colors = [];
        for (let i = 0; i < n; i ++) {
            colors.push(rainbow[i * div]);
        }
        return colors;
    };
    const rainbowColors = getColors(depthNodes.length);
    let c = 0;
    depthNodes.forEach ((d , i) => {
        const info = {
            name: d.data.name,
            x: 0,
            y: 0,
            // color: nodeColor( color.get(i)),
            color: rainbowColors[i],
        };

        c = dataOpt.showDistinctNodeName ? 1 : (Math.floor(len / 10) < 2) ? 1 : 2;

        const a = i % c;
        const b = Math.ceil(((i + 1) / c)) - 1;
        info.x = a * 250;
        info.y = b * 25;

        depthNodesLegend.push(info);
    });

    nodes.forEach(d => {
        if (d.depth < treeDepth) {
            colorNodes[d.data.name] = "#aaa";
            colorLinks[d.data.name] = "#777";
        } else  {
            const node_name = d.data.name;
            let tempNode = d;
            while (tempNode.depth !== treeDepth) {
                tempNode = tempNode.parent;
            }
            depthPathNodes[d.data.name] = tempNode.data.name;
            depthNodes.forEach((d, j) => {
                if (d.data.name === tempNode.data.name) {
                    colorNodes[node_name] = rainbowColors[j];
                    colorLinks[node_name] = dark50(rainbowColors[j]);
                    return true;
                }
            });
        }
    });

    return {colorNodes, colorLinks, depthPathNodes, depthNodesLegend};
}

export function loadTreeData(data) { // only contains the nodes have at least one S level child

    const s_dict = [];

    const Name = data.columns[0];

    data.forEach( d => {

        if (typeof(d[Name]) === "string") {
            d[Name] = d[Name].split("|");
        }

        const arr_len = d[Name].length;

        if (d[Name][arr_len - 1][0] === dataOpt.allLevel[dataOpt.level] && library.matrix_dict[d[Name][arr_len - 1]]) {

            const isDistinct = library.matrix_dict[d[Name][arr_len - 1]].qvalue < dataOpt.maxQvalue;

            const textLength = text_size.measuredTextSize(d[Name][arr_len - 1].substring(3)).width;
            dataOpt.maxTextLength = Math.max(dataOpt.maxTextLength, textLength);

            const isEnter = (dataOpt.distinctNodeOnly) ? (isDistinct) ? true : false : true ;

            if (isEnter) {
                d[Name].some(n => {
                    if (!s_dict[n]) {
                        s_dict[n] = 1;
                    }
                });
            }

        }
    });

    return s_dict;
}

export function main(_data) {

    library.s_dict = loadTreeData(_data);

    const all_info_box = [];

    const tree = new Tree("r__Root");

    const Name = _data.columns[0];

    let group1_length = 0;
    let group2_length = 0;

    _data.some(d => {

        const arr_len = d[Name].length;

        if (library.s_dict[d[Name][arr_len - 1]]) {

            const node = new Node(d[Name][arr_len - 1]);

            tree.add(node);

            let parent_name, parent_node;

            if (arr_len === 1) {
                parent_name = "r__Root";
            } else {
                parent_name = d[Name][arr_len - 2];
            }

            parent_node = tree.allNode[parent_name];

            const child_num = parent_node.children.length;

            if (child_num  > 0) {
                parent_node.children[child_num - 1].next = node;
            }

            parent_node.addChild(node);
            node.parent = parent_node;

            const arr1 = [];
            const arr2 = [];
            Object.keys(d).forEach(key => {
                if (library.id_group.dict[key]) {
                    if (library.id_group.dict[key] === library.id_group.group1) {
                        arr1.push(parseFloat(d[key]));
                    } else if (library.id_group.dict[key] === library.id_group.group2) {
                        arr2.push(parseFloat(d[key]));
                    }
                }
            });
            group1_length = arr1.length;
            group2_length = arr2.length;
            all_info_box[d[Name][arr_len - 1]] = { group1: arr1, group2: arr2 };
        }

    });

    const mean_info_box = [];
    let max_mean = 0;
    let min_mean = 100;
    Object.keys(all_info_box).forEach(key => {
        const temp_mean = Math.log2(library.matrix_dict[key].mean_group1 * group1_length + library.matrix_dict[key].mean_group2 * group2_length + 2) * 1.5;
        mean_info_box[key] = temp_mean;
        max_mean = Math.max(temp_mean, max_mean);
        min_mean = Math.min(temp_mean, min_mean);
    });

    let i = 0;
    let newick = "";

    let curr = tree.root;

    while (1) {

        while (i !== dataOpt.level) {
            newick = (curr.Name === "r__Root") ? "r__Root" : (newick[0] !== ",") ? `${curr.Name})` + newick : curr.Name + newick;
            curr = curr.children[0];
            i++;
        }

        newick = ")" + newick;

        while (curr.next !== null) {
            newick = `,${curr.Name}` + newick;
            curr = curr.next;
        }

        newick = curr.Name + newick;

        while (curr.next === null) {

            curr = curr.parent;
            i--;
            newick = "(" + newick;

            if (i === 0) {
                break;
            }

        }

        newick = "," + newick;

        if (i !== 0) {
            curr = curr.next;
        } else {
            break;
        }
    }

    newick = newick.substring(1);

    const treeNewick = parseNewick(newick);
    const treeData = parseTreeData(treeNewick);

    const hierarchy = d3.hierarchy(treeData).sum(d => d.length);

    const allNodes = [];
    const leaves = [];
    const nodes = [];

    let box_values = [];

    hierarchy.each(n => {
        if  (n.children) {
            nodes.push(n);
        }  else  {
            leaves.push(n);
            box_values = box_values.concat(all_info_box[n.data.name].group1);
            box_values = box_values.concat(all_info_box[n.data.name].group2);
        }
        allNodes.push(n);
    });

    const distinct_leaves = {
        UL: {
            maxTextLength: 0,
            nodes: [],
        },
        UR: {
            maxTextLength: 0,
            nodes: [],
        },
        DL: {
            maxTextLength: 0,
            nodes: [],
        },
        DR: {
            maxTextLength: 0,
            nodes: [],
        },
    };

    const leave_link_dict = [];

    const basic_angle = 360.0 / (2 * leaves.length);

    leaves.some((n, i) => {
        if (library.matrix_dict[n.data.name].qvalue < dataOpt.maxQvalue) {
            if (i < leaves.length * 0.25) {

                distinct_leaves.UR.maxTextLength = Math.max(distinct_leaves.UR.maxTextLength, text_size.measuredTextSize(n.data.name).width);
                distinct_leaves.UR.nodes.push({
                    name: n.data.name,
                    x: 0.0,
                    y: 0,
                });

                leave_link_dict[n.data.name] = {
                    x: (dataOpt.treeRadius - dataOpt.treeLeafSize) * Math.sin(((i * 2 + 1) * basic_angle) * 0.017453293) + 680,
                    y: - (dataOpt.treeRadius - dataOpt.treeLeafSize) * Math.cos(((i * 2 + 1) * basic_angle) * 0.017453293) + 395,
                };

            } else if (i < leaves.length * 0.5) {

                distinct_leaves.DR.maxTextLength = Math.max(distinct_leaves.DR.maxTextLength, text_size.measuredTextSize(n.data.name).width);
                distinct_leaves.DR.nodes.push({
                    name: n.data.name,
                    x: 0.0,
                    y: 0,
                });

                leave_link_dict[n.data.name] = {
                    x: (dataOpt.treeRadius - dataOpt.treeLeafSize) * Math.sin(((i * 2 + 1) * basic_angle) * 0.017453293) + 695,
                    y: - (dataOpt.treeRadius - dataOpt.treeLeafSize) * Math.cos(((i * 2 + 1) * basic_angle) * 0.017453293) + 425,
                };

            } else if (i < leaves.length * 0.75) {

                distinct_leaves.DL.maxTextLength = Math.max(distinct_leaves.DL.maxTextLength, text_size.measuredTextSize(n.data.name).width);
                distinct_leaves.DL.nodes.push({
                    name: n.data.name,
                    x: text_size.measuredTextSize(n.data.name).width,
                    y: 0,
                });

                leave_link_dict[n.data.name] = {
                    x: (dataOpt.treeRadius - dataOpt.treeLeafSize) * Math.sin(((i * 2 + 1) * basic_angle) * 0.017453293) + 695,
                    y: - (dataOpt.treeRadius - dataOpt.treeLeafSize) * Math.cos(((i * 2 + 1) * basic_angle) * 0.017453293) + 425,
                };

            } else {

                distinct_leaves.UL.maxTextLength = Math.max(distinct_leaves.UL.maxTextLength, text_size.measuredTextSize(n.data.name).width);
                distinct_leaves.UL.nodes.push({
                    name: n.data.name,
                    x: text_size.measuredTextSize(n.data.name).width,
                    y: 0,
                });

                leave_link_dict[n.data.name] = {
                    x: (dataOpt.treeRadius - dataOpt.treeLeafSize) * Math.sin(((i * 2 + 1) * basic_angle) * 0.017453293) + 695,
                    y: - (dataOpt.treeRadius - dataOpt.treeLeafSize) * Math.cos(((i * 2 + 1) * basic_angle) * 0.017453293) + 425,
                };

            }
        }
    });

    distinct_leaves.UL.nodes.forEach((node, i) => {
        node.x = (170 - node.x) + 50;
        node.y = (distinct_leaves.UL.nodes.length - i - 1) * 25 + 50;
    });
    distinct_leaves.DL.nodes.forEach((node, i) => {
        node.x = (170 - node.x) + 50;
        node.y = (distinct_leaves.DL.nodes.length - i - 1) * 25 + 60 + 325;
    });
    distinct_leaves.DR.nodes.forEach((node, i) => {
        node.y = i * 25 + 60 + 325;
    });
    distinct_leaves.UR.nodes.forEach((node, i) => {
        node.y = i * 25 + 50;
    });

    library.color_dict = getLinkColor(allNodes, dataOpt.treeDepth);

    const max = 0;
    const min = 0;
    // const max = Math.max(...box_values) + dataOpt.logPara;
    // const min = Math.min(...box_values) + dataOpt.logPara;

    const leave_box_dict = [];

    leaves.some(l => {
        leave_box_dict[l.data.name] = {
            group1: boxPlotValue(all_info_box[l.data.name].group1, max, min),
            group2: boxPlotValue(all_info_box[l.data.name].group2, max, min),
        };
    });

    dataOpt.isRadical = (leaves.length > 20) ? true : false ;
    const branchShouldStayOnTop = (l, t) => {
        if (l.target.data.data.qvalue < dataOpt.maxQvalue)
            return true;
        return false;
    };
    if (!!this) this.data.branchShouldStayOnTop = branchShouldStayOnTop;

    console.log(treeData.children[0].data);
    return {treeData, dataOpt, leave_box_dict, mean_info_box, max_mean, min_mean, library, allNodes, leaves, distinct_leaves, leave_link_dict, _data, max, min};
}
function parseTreeData(tree) {
    if (library.matrix_dict[tree.name]) tree.data = library.matrix_dict[tree.name];
    if (tree.children) {
        tree.children.map(child => {
            parseTreeData(child);
        });
    }  
    return tree;
}

export function updateBranchZIndex(v) {
    if (!v || !v.data) return;
    const branchShouldStayOnTop = (l, t) => {
        if (l.target.data.data.qvalue < v.data.main.dataOpt.maxQvalue)
            return true;
        return false;
    }
    v.data.branchShouldStayOnTop = branchShouldStayOnTop;
}