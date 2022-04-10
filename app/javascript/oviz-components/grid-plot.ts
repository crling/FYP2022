import { Component, XYPlotOption } from "crux/dist/element";

export interface GridPlotOption extends XYPlotOption {
    xLabel: string;
    yLabel: string;
    plotSize: [number, number]; // [width, height]
    legend: any;
    discreteCategory: boolean;
    yAxisRotated: boolean;
    xAxisRotated: boolean;
    labelOffsetVer: number;
    labelOffsetHor: number;
    labelFontSize: number;
    tickFontSize: number;
}

export class GridPlot extends Component<GridPlotOption> {

    protected xAxisRotation = 45;
    public render() {
        return this.t`
        XYPlot{
            @props prop
            height = 30 + prop.plotSize[1]
            width = 35 + prop.plotSize[0]
            padding-l = 35; padding-b = 30
            @yield background default {
                Rect.full {
                    fill = "none"; strokeWidth = 1; stroke = "black"
                }
            }
            @yield content with prop.data
            @yield leftAxis default {
            @if prop.yAxisRotated {
                Axis("left") {
                    :label(tick) {
                        Text(tick.value) {
                            x = -5; anchor = @anchor("c", "b")
                            rotation = @rotate(-90)
                            fontSize = prop.tickFontSize
                        }
                    }
                }
            } @else {
                Component {
                    // @expr console.log("????")
                }
                Axis("left") {
                    label.fontSize = prop.tickFontSize
                }
            }
            }
            @yield bottomAxis default {
                @if prop.xAxisRotated {
                    Axis("bottom") {
                        y = 100%
                        :label(tick) {
                            Text(tick.value) {
                                @let tickX = @scaled-x(tick.value)
                                @let tickY = 5
                                behavior:drag {
                                    direction = "polar"
                                    origin = [tickX, tickY]
                                    onDrag = @bind(adjustLabel)
                                }
                                y = 5; anchor = @anchor("r", "m")
                                rotation = @rotate(-xAxisRotation)
                                fontSize = prop.tickFontSize
                            }
                        }
                    }
                } @else {
                    Component {
                        // @expr console.log("????")
                    }
                    Axis("bottom"){
                        y = 100%
                        label.fontSize = prop.tickFontSize
                    }
                }
            }
            EditText {
                text = prop.flip ? prop.xLabel : prop.yLabel
                x = -prop.labelOffsetVer; y = 50%; rotation = @rotate(-90)
                fontSize = prop.labelFontSize
                anchor = @anchor("m", "c")
            }
            EditText {
                text = prop.flip ? prop.yLabel : prop.xLabel
                x = 50%; y = @geo(100,prop.labelOffsetHor)
                fontSize = prop.labelFontSize
                anchor = @anchor("t", "c")
            }
        }`;
    }

    protected adjustLabel(ev, el, delta, cuur) {
        this.xAxisRotation = cuur[0] * 180 / Math.PI;
        this.redraw();
    }

    public defaultProp() {
        return {
            ...super.defaultProp(),
            xLabel: "",
            yLabel: "",
            labelFontSize: 12,
            tickFontSize: 10,
            labelOffsetVer: 25,
            labelOffsetHor: 15,
        };
    }
}

export const generateGridPlotConfig = (v) =>  ({
    id: "plot-st",
    title: "Plot Settings",
    layout: "single-page",
    view: {
        type: "list",
        items: [
            {
                title: "plot width",
                type: "input",
                value: {
                    current: v.data.config.plotSize[0],
                    callback(d) {
                        v.data.config.plotSize[0] = parseFloat(d);
                        v.forceRedraw = true;
                        v.run();
                    },
                },
            },
            {
                title: "plot height",
                type: "input",
                value: {
                    current: v.data.config.plotSize[1],
                    callback(d) {
                        v.data.config.plotSize[1] = parseFloat(d);
                        v.forceRedraw = true;
                        v.run();
                    },
                },
            },
            {
                title: "label font size",
                type: "input",
                value: {
                    current: v.data.config.labelFontSize,
                    callback(d) {
                        v.data.config.labelFontSize = parseFloat(d);
                        v.forceRedraw = true;
                        v.run();
                    },
                },
            },
            {
                title: "tick font size",
                type: "input",
                value: {
                    current: v.data.config.tickFontSize,
                    callback(d) {
                        v.data.config.tickFontSize = parseFloat(d);
                        v.forceRedraw = true;
                        v.run();
                    },
                },
            },
            {
                title: "rotate x axis labels",
                type: "checkbox",
                value: {
                    current: v.data.config.xAxisRotated,
                    callback(d) {
                        v.data.config.xAxisRotated = d;
                        v.forceRedraw = true;
                        v.run();
                    },
                },
            },
        ],
    },
});
