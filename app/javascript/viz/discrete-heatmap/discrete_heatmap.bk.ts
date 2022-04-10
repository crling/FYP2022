import { Component, ComponentOption } from "crux/dist/element";

export interface DiscreteHeatMapOption extends ComponentOption {
    rows: [];
    columns: [];
    data: [][];
    rowName: string;
    colName: string;
    gridW: number;
    gridH: number;
    colorMap: any;
    valueMap: any;
    drawRows: boolean;
    colLabelRotaton: number; // the rotation angle for column labels
}

export class DiscreteHeatMap extends Component<DiscreteHeatMapOption> {
    render() {
        return this.t`
            Component{
                Rows {
                    @for (row, i) in prop.data {
                        @if (prop.drawRows) {
                            Component {
                                width = prop.gridW * 1.5
                                Text {
                                    anchor = @anchor("r","t")
                                    text = prop.rows[i] + "  "
                                }
                            }
                        }
                        Columns {
                            @for (d, j) in row {
                                Component {
                                    width = prop.gridW
                                    height = prop.gridH
                                    Rect {
                                        // key = n
                                        height = 100%; width = 100%;
                                        stroke = "black"
                                        strokeWidth = 1
                                        fill = prop.colorMap.get(d)
                                        behavior:tooltip { content = getTooltipContent(d, i, j) }
                                    }
                                }
                            }
                        }
                    }
                    Columns {
                        @for c in prop.columns {
                            Component {
                                width = prop.gridW
                                Text {
                                    text = c
                                    x = prop.gridW/2
                                    y = 2
                                    anchor = @anchor("r","m")
                                    rotation = @rotate(-1 * prop.colLabelRotaton)
                                }
                            }
                        }
                    }
                }
            }`;
    }

    protected getTooltipContent(d, i, j) {
        return `${this.prop.rowName}: ${this.prop.rows[i]}</br>
            ${this.prop.colName}: ${this.prop.columns[j]}</br>
            data: ${this.prop.valueMap.get(d)}`;
    }
}
