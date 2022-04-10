import Oviz from "crux";
//import { editorConfig, editorRef } from "./editor";
import template from "./template.bvt";

import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { GridPlot } from "oviz-components/grid-plot";
import { EditText } from "oviz-components/edit-text";
import { register } from "page/visualizers";
import { rankDict, sortByRankKey } from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";
import { FYPPlot } from "oviz-components/FYP4";

const title = "fyp-graph1";
const height = 600;
const width = 1500;
const MODULE_NAME = "FYP4";
 
function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components:{FYPPlot},
        data: {
            title,
            labelFontSize: 12, //有关
            tickFontSize: 14
        },
        loadData: {
            data: {
                fileKey: "FYP1",
                type: "csv", 
                multiple: false,
                loaded(data) { 
                    console.log("data:",data);
                    this.data.plot = true;
                    console.log("first data:",data);
                    let type = data.map(d => d[data.columns[0]]);
                    type.unshift(data.columns[0]);
                    console.log("type:",type)
                    let temp_length = data.map(d => d[data.columns[1]]);//.unshift(30427671);
                    temp_length.unshift(data.columns[1])
                    const length=[] ;
                    for(let i = 0;i<5;i++){
                        length[i]=temp_length[i];
                    }
                    console.log("length:",length)
                    this.data.type = type;
                    this.data.length = length;
                    this.data.height = height;
                    this.data.width = width;

                },
            },
            data2:{
                fileKey:"FYP12",
                type:"csv",
                multiple: false,
                loaded(data){
                    console.log("second data:",data);
                    let id =data.map(d => d[data.columns[0]]);
                    id.unshift(data.columns[0]);
                    let types = data.map(d => d[data.columns[1]]);
                    types.unshift(data.columns[1]);
                    let startpo = data.map(d => d[data.columns[2]]);
                    startpo.unshift(data.columns[2]);
                    let endpo = data.map(d => d[data.columns[3]]);
                    endpo.unshift(data.columns[3]);
                    let pone = data.map(d => d[data.columns[4]]);
                    pone.unshift(data.columns[4]);
                    // calculate the length and the max length
                    let maxlength = this.data.length[0];
                    this.data.length.forEach(element =>{
                        if(element > maxlength){
                            maxlength = element;
                        }
                    });
        
                    // get the down_value and up_value of each type 
                    const value1 = [], value2 = [], value3 = [], value4 = [], value5 = [];
                    const values = [value1,value2,value3,value4,value5];
                    const type1 = [],type2 = [],type3 = [],type4 = [],type5 = [];
                    const typess = [type1,type2,type3,type4,type5];
                    let endpl1, endpl2,endpl3,endpl4,endpl5;
                    const endpl = [endpl1,endpl2,endpl3,endpl4,endpl5];
                    types.forEach((element,i)=>{
                        typess[element-1].push((parseInt(startpo[i])+parseInt(endpo[i]))/2);
                    });
                    console.log("typess",typess)
                    typess.forEach((item,index)=>{
                        let re_position= item[0];
                        item.forEach((element,i)=>{
                            const gene = new Object();
                            gene["gene_name"]= id[i];
                            gene["position"]= element;
                            gene["side"]= pone[i];
                            if(i == 0 && element>maxlength/50){
                                re_position = element;
                            }else if (i ==0 && element<maxlength/50){
                                re_position = maxlength/50
                            }else {
                                if(element-re_position < maxlength/50){
                                    re_position += maxlength/50;
                                }else{
                                    re_position = element;
                                }
                            }
                            gene["re_position"] = re_position;
        
                            // assign the gene information according to the type and +/
                            values[index].push(gene);
                        });
                        if(this.data.length[index]-re_position < maxlength/50){
                            endpl[index] = re_position+maxlength/50; 
                        }else{
                            endpl[index] = this.data.length[index];
                        }
                    });
                    console.log("maxlength",maxlength)
                    // build the chrom_data information
                    const chrom_data = [];
                    // build the chrom_data1 object
                    const chrom_data1 = {
                        length: parseInt((this.data.length[0]/1000000).toFixed(2)),
                        value: value1,
                        each_step:height/maxlength,
                        endpl:endpl[0]
                    };
                    //add chrom_data1 to chrom_data
                    chrom_data.push(chrom_data1);
                    //build the chrom_data2 object
                    const chrom_data2 = {
                        length: parseInt((this.data.length[1]/1000000).toFixed(2)),
                        value: value2,
                        each_step: height/maxlength,
                        endpl:endpl[1]
                    };
                    //add chrom_data2 to chrom_data
                    chrom_data.push(chrom_data2);
                    //build the chrom_data3 object
                    const chrom_data3 = {
                        length: parseInt((this.data.length[2]/1000000).toFixed(2)),
                        value: value3,
                        each_step: height/maxlength,
                        endpl:endpl[2]
                    };
                    //add chrom_data3 to chrom_data
                    chrom_data.push(chrom_data3);
                    //build the chrom_data4 object
                    const chrom_data4 = {
                        length: parseInt((this.data.length[3]/1000000).toFixed(2)),
                        value: value4,
                        each_step: height/maxlength,
                        endpl:endpl[3]
                    };
                    //add chrom_data4 to chrom_data
                    chrom_data.push(chrom_data4);
                     
                    //build the chrom_data5 object
                    const chrom_data5 = {
                        length: parseInt((this.data.length[4]/1000000).toFixed(2)),
                        value: value5,
                        each_step: height/maxlength,
                        endpl:endpl[4]
                    };
                    //add chrom_data5 to chrom_data
                    chrom_data.push(chrom_data5);

                    const ruler = []; 
                    let maxruler = (maxlength /1000000) +1;
                    for(let i= 0; i<=maxruler;i++){
                        ruler.push(i);
                    }
                    console.log("ruler",ruler)
                    
                    const prop = {
                        chrom_data : chrom_data,
                        length : this.data.length,
                        width : this.data.width,
                        height : this.data.height,
                        maxlength : maxlength,
                        ruler : ruler,
                        maxruler: maxruler,
                        plot : this.data.plot,
                    }
                    //return chrom_data information
                    this.data.ruler = ruler
                    this.data.chrom_data = chrom_data;
                    this.data.maxlength = maxlength;
                    this.data.maxruler = maxruler;
                    this.data.prop = prop;
           
                    return {chrom_data,length,maxlength,ruler,maxruler};
                }

            }
        },
        setup() { 
            console.log("this.data:",this["_data"]);
            //registerEditorConfig(editorConfig(this), editorRef);
        },
    });

    return visualizer;
}

export function registerBoxplot() {
    register(MODULE_NAME, init);
}
register(MODULE_NAME, init);
