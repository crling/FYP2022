import Oviz from "crux";
//import { editorConfig, editorRef } from "./editor";
import template from "./template.bvt";

import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { GridPlot } from "oviz-components/grid-plot";
import { EditText } from "oviz-components/edit-text";
import {register} from "page/visualizers";
import { rankDict, sortByRankKey } from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";

const color = "#3d8eff";
const xlabel = "";
const ylabel = "";
const title = "Gene Structure";
const xAxisIndex  = 0;
const yAxisIndex = 1;

const MODULE_NAME = "FYP2";
 
function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        data: {
            title,
            labelFontSize: 12, //有关
            tickFontSize: 14,
            color, xlabel, ylabel,xAxisIndex, yAxisIndex
        },
        loadData: {
            data: {
                fileKey: "FYP2",
                type: "csv", 
                multiple: false,
                loaded(data) { 
                    console.log("data:",data)
                    const xAxisKey = data.columns[xAxisIndex];
                    const yAxisKey = data.columns[yAxisIndex];
                    const IDKey= data.columns[8];
                    const ID = data.map(d => d[IDKey]);
                    const typeKey= data.columns[2];
                    const type = data.map(d => d[typeKey]);
                    const position1Key= data.columns[3];
                    const position1 = data.map(d => d[position1Key]);
                    const position2Key= data.columns[4];
                    const position2 = data.map(d => d[position2Key]);
                    const result = [];
                    //const sortedResult =[];
                    const sortedResult = [];
                    //const parentID2 = IDKey.split(';',1);
                    //console.log(parentID2);
                    data.forEach(d => {
                        //console.log(d);
                        result.push([d[IDKey].split(';',1)[0], d[typeKey],d[position1Key],d[position2Key]]);
                    });
                    //console.log(result);
                    //find 5' and 3' add the data between to the same array
                    //var parentID = result[0][0].split('=',2).toString();
                    var counter = 0;
                    var eachResult = [];
                    var startPosition;
                    result.forEach((item,index) =>{
                        console.log("item",item)
                        if(index == 0){
                            eachResult.push(item);
                            startPosition = item[2];
                        }
                        else if (item[0].split('=',2)[1] == result[index-1][0].split('=',2)[1]){
                            eachResult.push(item);
                            if(item[1]=="five_prime_UTR"){
                                startPosition = item[2];
                            }
                        }
                        else {
                            console.log("eachResult",eachResult);
                            sortedResult.push(eachResult);
                            eachResult = [];
                        }
                    })  
                    console.log("sortedResult",sortedResult);
                    //find the start position of 5' in each ite
                    var startPosition = position1[0];
                    //sorted
                    //find the minimum and maximum position to determine the length
                    var five_prime_UTR_min = position1[0];
                    var three_prime_UTR_max = position2[0];
                    data.forEach(d=>{
                        if(d[typeKey] == "five_prime_UTR" && d[position1Key] - five_prime_UTR_min <0){
                            five_prime_UTR_min = d[position1Key];
                        }
                    });
                    data.forEach(d=>{
                        if(d[typeKey] == "three_prime_UTR" && d[position2Key] - three_prime_UTR_max>0){
                            three_prime_UTR_max = d[position2Key];
                        }
                    });
                    console.log(five_prime_UTR_min);
                    console.log(three_prime_UTR_max);
                    const max_length = three_prime_UTR_max - five_prime_UTR_min;
                    console.log(max_length);
                    this.data.gene_data=sortedResult;
                    this.data.max_length=max_length;
                    this.data.five_prime_UTR_min=five_prime_UTR_min;
                    return {sortedResult,max_length,five_prime_UTR_min};

                },
            },
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
