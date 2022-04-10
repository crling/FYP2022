import Oviz from "crux"
import {template} from "../../template/histo"
import axios from "axios"
 
const color = "#3d8eff";
const xlabel = "Name";
const ylabel = "Age";
const title = "Our lab members' age";
const xAxisIndex  = 0;
const yAxisIndex = 1;
// please change the displayed value range in the template by the prop: valueRange.

function init() {
  //读取csv文件
    var data;
    axios.get('/data/histo_test.csv')
    .then(response => {
        data = response.data;
      //以下直方图部分来自chart.oviz.org，包含处理csv和画图
        Oviz.visualize({
            el: "#canvas",
            template,
            data: {color, xlabel, ylabel, title, xAxisIndex, yAxisIndex},
            loadData: {
                data: {
                    content: data,
                    type: "csv",
                    loaded(data) {
                        const xAxisKey = data.columns[xAxisIndex];
                        const yAxisKey = data.columns[yAxisIndex];
                        const result = [];
                        data.forEach(d => {
                            result.push([d[xAxisKey], d[yAxisKey]]);
                        });
                        return result;
                    },
                },
            },       
        });//来自chart.oviz.org的部分到此结束
    });
}

