import Crux from "crux";
import * as text_size from "crux/dist/utils/text-size";
import * as d3 from "d3-hierarchy";

export let dataOpt = {
    min: 0.05,
    Abundance: 0,
    nodeAbundance: 100,
    aName: "",
    maxLength: 0,
    maxHeight: 0,
    treeHeight: 800,
    treeDepth: 3,
    classficationRank: null,
    treeRadius: 0,
    color: Crux.color.ColorSchemeGradient.create("#eef4fa", "#1565C0"),
    isRadical: null,
    isChanged: false,
};

export function convert(key) {
    switch (key) {
        case "R": {
            key = 8;
            break;
        }
        case "D": {
            key = 7;
            break;
        }
        case "K": {
            key = 6;
            break;
        }
        case "P": {
            key = 5;
            break;
        }
        case "C": {
            key = 4;
            break;
        }
        case "O": {
            key = 3;
            break;
        }
        case "F": {
            key = 2;
            break;
        }
        case "G": {
            key = 1;
            break;
        }
        case 8: {
            key = "Root";
            break;
        }
        case 7: {
            key = "Domain";
            break;
        }
        case 6: {
            key = "Kingdom";
            break;
        }
        case 5: {
            key = "Phylum";
            break;
        }
        case 4: {
            key = "Class";
            break;
        }
        case 3: {
            key = "Order";
            break;
        }
        case 2: {
            key = "Family";
            break;
        }
        case 1: {
            key = "Genus";
            break;
        }
        case 0: {
            key = "Species";
        }
    }
    return key;
}

export function lightenColor(color) {
    color = color.split("(")[1].substring(0, color.length - 1);
    const h = parseFloat(color.split(",")[0]);
    const s = parseInt(color.split(",")[1].substring(0, color.length - 1)) - 20;
    const l = parseInt(color.split(",")[2].substring(0, color.length - 1)) + 20;
    return `hsl(${h},${s}%,${l}%)`;
}

export function loadKraken(_data, min) {
    const data = [];

    _data.some(d => {
        if (d.R < "A" || d.R > "Z" || d.R === "U" || d.R.length !== 1) {
            if (d.R === "U") {
                dataOpt.nodeAbundance = parseFloat((100 - parseFloat(d.Abundance)).toFixed(2));
            }
            return;
        } else if  (d.R === "S") {
            d.root = d.root.trim();
            data.push(d);
        } else {

            const currentRank = convert(d.R);
            d.root = d.root.trim();

            if (data.length === 0 || currentRank < convert(data[data.length - 1].R)) {
                data.push(d);
            } else {
                if (data[data.length - 1].R === "S") {
                    const validS = [];
                    while (data[data.length - 1].R === "S") {
                        const abu = parseFloat(data[data.length - 1].Abundance);
                        if (abu > min) {
                            validS.push(data.pop());
                        } else {
                            data.pop();
                        }
                    }

                    if (validS.length === 0) {
                        while (data.length > 1 && data[data.length - 1].R !== "S") {
                            data.pop();
                        }
                    } else {
                        while (validS.length !== 0) {
                            const s = validS.pop();

                            const abund = parseFloat(s.Abundance);
                            if (dataOpt.Abundance < abund) {
                                dataOpt.Abundance = abund;
                                dataOpt.aName = s.root;
                            }
                            const len = text_size.measuredTextSize(s.root);
                            if  (dataOpt.maxLength < len.width) {
                                dataOpt.maxLength = len.width;
                                dataOpt.maxHeight = len.height;
                            }

                            data.push(s);
                        }
                    }

                } else {
                    while (currentRank > convert(data[data.length - 1].R)) {
                        data.pop();
                    }
                    if (currentRank === convert(data[data.length - 1].R)) {
                        data.pop();
                    }
                }
                data.push(d);
            }
        }
    });

    if (data[data.length - 1].R !== "S") {
        while (data.length !== 0 && data[data.length - 1].R !== "S") {
            data.pop();
        }
    } else {
        const validS = [];
        const abu = parseFloat(data[data.length - 1].Abundance);
        if (abu > min) {
            if (dataOpt.Abundance < abu) {
                dataOpt.Abundance = abu;
                dataOpt.aName = data[data.length - 1].root;
            }
            const len = text_size.measuredTextSize(data[data.length - 1].root.trim());
            if  (dataOpt.maxLength < len.width) {
                dataOpt.maxLength = len.width;
                dataOpt.maxHeight = len.height;
            }
            validS.push(data.pop());
        } else {
            data.pop();
        }

        if (validS.length === 0) {
            while (data.length > 1 && data[data.length - 1].R !== "S") {
                data.pop();
            }
        } else {
            while (validS.length !== 0) {
                data.push(validS.pop());
            }
        }
    }

    return data;
}

export function loadYuJ(data) {

    const only_s = [];

    const Name = data.columns[0];
    const Abundance = data.columns[1];

    data.some( d => {

        if (typeof(d[Name]) === "string") {
            d[Name] = d[Name].split("|");
        }

        const arr_len = d[Name].length;

        if (arr_len === 7 && d[Abundance] > dataOpt.min) {

            d[Name].some(n => {
                if (!only_s[n]) {
                    only_s[n] = 1;
                }
            });

            const abund = parseFloat(d[Abundance]);
            if ( abund > dataOpt.Abundance) {
                dataOpt.Abundance = abund;
                dataOpt.aName = d[Name][6].substring(3);
            }
            const len = text_size.measuredTextSize(d[Name][6]);
            if  (dataOpt.maxLength < len.width) {
                dataOpt.maxLength = len.width;
                dataOpt.maxHeight = len.height;
            }

        }
    });

    const all_node = [];

    data.some( d => {

        const arr_len = d[Name].length;

        if (only_s[d[Name][arr_len - 1]]) {
            all_node[d[Name][arr_len - 1]] = d;
        }

    });

    const kraken_data = [];

    kraken_data.push({
        Abundance: "100",
        R: "R",
        id: "",
        root: "Root",
    });

    kraken_data.push({
        Abundance: "100",
        R: "D",
        id: "",
        root: "Domain_undefined",
    });

    for (let key in only_s) {

        const kraken = {
            Abundance: all_node[key][Abundance].toString(),
            R: key[0].toUpperCase(),
            id: "?term=" + key.substring(3),
            root: key.substring(3),
        };

        kraken_data.push(kraken)
    }

    return kraken_data;
}

export function getTreeData(data) {

    let directory = new Map();
    let treeData = "((((((((";

    data.some((d, i) => {
        if (d.R !== "S") {
            if (directory.size !== 8 ) {
                directory.set(convert(d.R), d.root);
            } else {
                const height = convert(d.R);
                treeData = treeData.substring(0, treeData.length - 1);
                treeData += ")";
                let j = 1;
                while (j <= height) {
                    treeData += directory.get(j)  + ")";
                    directory.delete(j++);
                }
                treeData = treeData.substring(0, treeData.length - 1);
                treeData += ",";
                j = height;
                while (j--) {
                    treeData += "(";
                }
                directory.set(height, d.root);
            }
            return;
        }

        if (directory.size !== 8) {
            let j = 1;
            while (j < 8) {
                if  (!directory.get(j)) {
                    directory.set(j, `Undefine${i}`);
                }
                j++;
            }
        }
        directory = new Map([...directory.entries()].sort());

        treeData += d.root + ",";

    });

    treeData = treeData.substring(0, treeData.length - 1) + ")";
    directory.forEach(d => { treeData += d  +  ")"; });

    directory.clear();

    return treeData.substring(0, treeData.length - 1);
}

export function getTreeSetUp(isRadical, leafCount) {
    dataOpt.treeHeight = 0;
    dataOpt.treeRadius = 0;

    dataOpt.isChanged = false;

    if (isRadical === null) {
        dataOpt.isRadical = (leafCount >= 30) ? true : false;
    }
    if (leafCount < 30) {
        let a, b, c;
        if (leafCount < 10) {
            a = 200 + dataOpt.maxLength;
            b = 50;
            c = 20;
        } else if  (leafCount < 30) {
            a = 400;
            b = 30;
            c = 15;
        }
        dataOpt.treeRadius = (isRadical) ? a : 0;
        dataOpt.treeHeight = (isRadical) ? dataOpt.treeRadius * 2 + b : dataOpt.treeHeight = leafCount * (dataOpt.maxHeight + c);
    } else  {
        let a;
        if  (leafCount < 60) {
            a = dataOpt.maxHeight + 20;
        } else  if  (leafCount < 80) {
            a = dataOpt.maxHeight + 10;
        } else  if  (leafCount < 100) {
            a = dataOpt.maxHeight + 5;
        } else {
            a = Math.log2(dataOpt.Abundance) * 2 + 10;
            dataOpt.isChanged = true;
            dataOpt.maxLength = Math.log2(dataOpt.Abundance) * 2 + 50;
        }
        dataOpt.treeRadius = (leafCount * a ) / (2 * Math.PI) + dataOpt.maxLength;
        dataOpt.treeHeight = dataOpt.treeRadius * 2 + 120;
    }

}

export function getNodeLeafData(treeData) {
    const newickData = Crux.utils.parseNewick(treeData);
    const hierarchy = d3.hierarchy(newickData).sum(d => d.length);

    const allNodes = [];
    const leaves = [];
    const nodes = [];

    hierarchy.each(n => {
        if  (n.children) {
            nodes.push(n);
        }  else  {
            leaves.push(n);
        }
        allNodes.push(n);
    });
    let maxLinkNodes;
    const linkNodes = [];
    leaves.forEach (d => {
        let current = d;
        const tempNodes = {
            leafName: "",
            pathNodes: [],
        };
        tempNodes.leafName = d.data.name;
        while (current !== null) {
            tempNodes.pathNodes.push(current);
            current = current.parent;
        }
        linkNodes.push(tempNodes);
        if (d.data.name === dataOpt.aName) {
            maxLinkNodes = tempNodes;
        }
    });

    const path = [];
    linkNodes.forEach (d => {
        const info = {
            leafName: "",
            linkNodes: "",
        };
        info.leafName = d.leafName;
        for (let j = 8; j >= 0; j--) {
            info.linkNodes += `${convert(d.pathNodes[j].height)}: ${d.pathNodes[j].data.name} <br>`;
        }
        path.push(info);
    });

    return {newickData, leaves, nodes, maxLinkNodes, path, allNodes};
}

export function getLinkColor(nodes) {

    const depthNodes = nodes.filter(d => d.depth === dataOpt.treeDepth);
    const len = depthNodes.length;

    const color = Crux.color.ColorSchemeCategory.create(len);

    const depthNodesLegend = [];
    let c = 0;
    depthNodes.forEach ((d , i) => {
        const info = {
            x: 0,
            y: 0,
            name: d.data.name,
            color: color.get(i),
        };

        c = (Math.floor(len / 10) <= 3) ? (Math.floor(len / 10) === 0) ? 1 : Math.floor(len / 10) : 3;

        const a = i % c;
        const b = Math.ceil(((i + 1) / c)) - 1;
        info.x = a * 250;
        info.y = b * 20;

        if (dataOpt.isChanged) {
            info.color = lightenColor(info.color);
        }
        depthNodesLegend.push(info);
    });

    const colorNodes = [];
    const depthPathNodes = [];
    nodes.forEach(d => {
        const colorInfo = {
            nodeName: d.data.name,
            color: null,
        };
        const depthInfo = {
            nodeName: d.data.name,
            depthName: null,
        };
        if (d.depth < dataOpt.treeDepth) {
            colorInfo.color = "#aaa";
            colorNodes.push(colorInfo);
        } else  {
            let tempNode = d;
            while (tempNode.depth !== dataOpt.treeDepth) {
                tempNode = tempNode.parent;
            }
            depthInfo.depthName = tempNode.data.name;
            depthPathNodes.push(depthInfo);
            depthNodes.forEach((d, j) => {
                if (d.data.name === tempNode.data.name) {
                    colorInfo.color = (dataOpt.isChanged) ? lightenColor(color.get(j)) : color.get(j);
                    return true;
                }
            });
            colorNodes.push(colorInfo);
        }
    });
    return {colorNodes, depthNodesLegend, depthPathNodes};
}

export function treeLoaded(_data) {

    let data = [];

    if (_data.columns.length === 2) {
        data = loadYuJ(_data);
    } else {
        data = loadKraken(_data, dataOpt.min);
    }

    const data_dict = [];

    data.some( d => {
        data_dict[d.root] = d;
    });

    const treeData = getTreeData(data);

    const nodeLeafData = getNodeLeafData(treeData);

    const newickData = nodeLeafData.newickData;
    const leaves = nodeLeafData.leaves;
    const nodes = nodeLeafData.nodes;
    const maxLinkNodes = nodeLeafData.maxLinkNodes;
    const path = nodeLeafData.path;
    const allNodes = nodeLeafData.allNodes;

    getTreeSetUp(dataOpt.isRadical, leaves.length);
    dataOpt.classficationRank = convert(8 - dataOpt.treeDepth);

    const linkColor = getLinkColor(allNodes);

    const colorNodes = linkColor.colorNodes;
    const depthPathNodes = linkColor.depthPathNodes;
    const depthNodesLegend = linkColor.depthNodesLegend;

    return {newickData, allNodes, leaves, nodes, maxLinkNodes, path, data_dict, dataOpt, colorNodes, depthPathNodes, depthNodesLegend, _data};
}
