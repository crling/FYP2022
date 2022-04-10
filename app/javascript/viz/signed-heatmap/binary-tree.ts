import { Component, ComponentOption } from "crux/dist/element";

export enum Gravity {
    Top = 0, Right, Bottom, Left,
}

export interface BinaryTreeOption extends ComponentOption {
    treeNode: BinaryTreeNode;
    parentsPos: number;
    parentsDep: number;
    depthUnit: number;
    gravity: Gravity;
    posUnit: number;
    strokeFill: string;
}

interface   BinaryTreeNode {
    children?: BinaryTreeNode[];
    name?: string;
    depth?: number;
    position: number;
}

export class BinaryTree extends Component<BinaryTreeOption> {

    private depthUnit: number;
    private posUnit: number;

    render() {
        return this.t`
        Component{
            @if prop.treeNode.children {
                @if prop.treeNode.length {
                    Path {
                        d = computeLinkPath(prop.treeNode, prop.parentsDep, prop.parentsPos, prop.gravity)
                        stroke = prop.strokeFill || @color("line")
                        fill = "none"
                    }
                }
                @let childProps = {
                    gravity: prop.gravity,
                    depthUnit: prop.depthUnit,
                    posUnit: prop.posUnit,
                    parentsPos: prop.treeNode.position,
                    parentsDep: prop.treeNode.depth,
                }
                BinaryTree {
                    treeNode = prop.treeNode.children[0]
                    @props childProps
                }
                BinaryTree {
                    treeNode = prop.treeNode.children[1]
                    @props childProps
                }
            }
            @else {
                Component {
                    Path {
                        d = computeLinkPath(prop.treeNode, prop.parentsDep, prop.parentsPos, prop.gravity)
                        stroke = prop.strokeFill || @color("line")
                        fill = "none"
                    }
                    // Circle {
                    //     rx = depthUnit * prop.treeNode.depth
                    //     ry = posUnit * prop.treeNode.position
                    //     r = 3
                    //     fill = "grey"
                    // }
                    // Text {
                    //     text = prop.treeNode.name
                    //     x = depthUnit * prop.treeNode.depth + 5
                    //     y = posUnit * prop.treeNode.position
                    // }
                }
            }
        }`;

    }

    public didCreate() {
        this.depthUnit = this.prop.depthUnit;
        this.posUnit = this.prop.posUnit;
    }

    computeLinkPath(node, pDepth, pPos, g): string {
        switch (g) {
            case Gravity.Bottom:
                return `M ${pPos * this.posUnit} ${pDepth * this.depthUnit}
                    L ${node.position * this.posUnit} ${pDepth * this.depthUnit}
                    L ${node.position * this.posUnit} ${node.depth * this.depthUnit}`;
            case Gravity.Right:
                return `M ${pDepth * this.depthUnit} ${pPos * this.posUnit}
                    L ${pDepth * this.depthUnit} ${node.position * this.posUnit}
                    L ${node.depth * this.depthUnit} ${node.position * this.posUnit}`;
        }
    }

}
