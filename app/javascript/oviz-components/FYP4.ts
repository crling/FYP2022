
import { Component, XYPlotOption } from "crux/dist/element";

export interface FYPPlotOption extends XYPlotOption{
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

    rowLine: boolean;
    columnLine: boolean;


}

export class FYPPlot extends Component<FYPPlotOption> {

    public render() {
        return this.t`
        Component {
            @props prop
            @expr console.log("prop",prop)
                @for (line, i) in prop.chrom_data {
                    Text{
                        x = i*prop.width/6+prop.width/150*11; y = 0;
                        text = i+1
                    }
                    Rect {
                        x = i*prop.width/6+prop.width/15; y = prop.height/30;
                        width = prop.width/50 ; height = prop.length[i]*line.each_step
                        cornerRadius = 30
                        fill = "none"
                        stroke = "black"
                    }
                    @for (item,index) in line.value {
                        @let temp_h = item.position*line.each_step;
                        //@expr console.log("temp_h",temp_h);
                        @let re_h = item.re_position*line.each_step;
                        Line {
                            x1 = i*prop.width/6+prop.width/15; y1 = temp_h+prop.height/30;
                            x2 = i*prop.width/6+prop.width/150*13; y2= temp_h+prop.height/30;
                        }	
                        Text{
                            anchor = @anchor("middle","right")
                            x= i*prop.width/6+prop.width/150*8; y = re_h+prop.height/30;
                            text = item.position
                        }
                        Line {
                            x1 = i*prop.width/6+prop.width/15;y1 = temp_h+prop.height/30;
                            x2 = i*prop.width/6+prop.width/150*8; y2 = re_h+prop.height/30;
                        }
                        Text{
                            anchor = @anchor("middle","left")
                            x= i*prop.width/6+prop.width/10; y = re_h+prop.height/30
                            text = item.gene_name
                        }
                        Line {
                            x1 = i*prop.width/6+prop.width/150*13;y1 = temp_h+prop.height/30;
                            x2 = i*prop.width/6+prop.width/10; y2 = re_h+prop.height/30;
                        }
                    }
            }
            
                    }
        `;
    }


    public defaultProp() {
        return {
            ...super.defaultProp(),
            width : 1500, //有关
            height : 600,
        };
    }

    

}
