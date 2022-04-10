let treeHeight: number;
let nodeSeq: number;
let nodeList: string[];

export function processTreeData(rootNode): any {
    nodeList = [];
    treeHeight = 0;
    nodeSeq = 0;
    rootNode = computeNodePosition(rootNode);
    rootNode.height = treeHeight;
    return {rootNode, nodeList};
}

function computeNodePosition(d): any {
    if (d.children) {
        d.children[0].depth = d.depth + d.children[0].length;
        d.children[1].depth = d.depth + d.children[1].length;
        if (!d.children[0].position) d.children[0] = computeNodePosition(d.children[0]);
        if (!d.children[1].position) d.children[1] = computeNodePosition(d.children[1]);
        d.position = (d.children[0].position + d.children[1].position) / 2;
    } else {
        nodeList.push(d.name);
        d.position = nodeSeq;
        if (treeHeight === 0 ) {
            treeHeight = d.depth;
        }
        nodeSeq++;
    }
    return d;
}
