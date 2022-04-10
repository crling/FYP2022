
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
            @if prop.plot == true{
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
            @elsif prop.plot == false {
                Line {
                   x1 = 5 ; y1 = prop.height/30+20
                   x2 = 5 ; y2 = prop.height/30+20+prop.maxruler*1000000*prop.chrom_data[0].each_step;
                   }
                   Text {
                   x = 5 ; y = prop.height/30+20+prop.maxruler*1000000*prop.chrom_data[0].each_step +10;
                   text = "M"
                   fontSize = 20
                   }
                   @for (item,index) in prop.ruler{
                   @if index % 5 == 0 {
                   Line{
                   x1 = 5; y1 = prop.height/30+20 + item*1000000*prop.chrom_data[0].each_step;
                   x2 = 25 ; y2 = prop.height/30+20 + item*1000000*prop.chrom_data[0].each_step;
                   }
                   Text {
                   x = 30 ; y  = prop.height/30+20 + item*1000000*prop.chrom_data[0].each_step -5;
                   text = item ;
                   }
                   }
                   @else{
                   Line{
                   x1 = 5; y1 = prop.height/30+20 + item*1000000*prop.chrom_data[0].each_step;
                   x2 = 15 ; y2 = prop.height/30+20 + item*1000000*prop.chrom_data[0].each_step;
                   }
                   }
                   }
                    @for (line, i) in prop.chrom_data{
                    Text{
                        x = i*prop.width/6+prop.width/150*11; y = 0;
                        text = i+1
                        fontSize = 18
                    }
                    Rect {
                    anchor = @anchor("top","left")
                        x = i*prop.width/6+prop.width/15; y = prop.height/30+20;
                        width = prop.width/50 ; height = prop.length[i]*line.each_step
                        cornerRadius = 30
                        fill = "black"
                        stroke = "black"
                    }
                    Text{
                    anchor = @anchor("middle","left")
                    x= i*prop.width/6+prop.width/10; y = prop.height/30+20
                    text = "0.0"
                    fontSize = 14
                    }
                    Line {
                    x1 = i*prop.width/6+prop.width/15+prop.width/100; y1 = prop.height/30+20;
                    x2 = i*prop.width/6+prop.width/10; y2 = prop.height/30+20;
                    }
                    Text{
                    anchor = @anchor("middle","left")
                    x= i*prop.width/6+prop.width/10; y = prop.height/30+20+line.endpl*line.each_step
                    text = line.length
                    fontSize = 14
                    }
                    Line {
                    x1 = i*prop.width/6+prop.width/15+prop.width/100; y1 = prop.height/30+20+prop.length[i]*line.each_step;
                    x2 = i*prop.width/6+prop.width/10; y2 = prop.height/30+20+line.endpl*line.each_step;
                    }
                    @for (item,index) in line.value {
                    @let temp_h = item.position*line.each_step;
                    //@expr console.log("temp_h",temp_h);
                    @let re_h = item.re_position*line.each_step;
                    Text{
                    anchor = @anchor("middle","left")
                    x= i*prop.width/6+prop.width/10; y = re_h+prop.height/30+20
                    text = item.gene_name
                    }
                    Line {
                    x1 = i*prop.width/6+prop.width/15+prop.width/100; y1 = temp_h+prop.height/30+20;
                    x2 = i*prop.width/6+prop.width/10; y2 = re_h+prop.height/30+20;
                    }
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
