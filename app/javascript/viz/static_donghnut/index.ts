
import Oviz from "crux"
import template from "./template.bvt"

const categoryIndex = 0;
const valueIndex = 1;
const Color = Oviz.color.Color;

export function init(id, path, config) {
    const title = config["title"];
    Oviz.visualize({
        el: id,
        template,
        data: {title},
        loadData: {
            pieData: {
                url: path,
                type: "tsv",
                dsvHasHeader: true,
                loaded(data) {
                    const pieData = [];
                    const legendData = [];
                    let sum = 0;
                    data.forEach(d => {
                        sum += parseFloat(Object.values(d)[valueIndex]);
                    });
                    data.forEach((d, i) => {
                        const num = parseFloat(Object.values(d)[valueIndex]);
                        const p = parseFloat(Object.values(d)[valueIndex]) / sum;
                        const name = `${Object.values(d)[categoryIndex]} - ${(p * 100).toFixed(2)}%`;
                        const c = Color.hsl((i%6)*60, 60+Math.floor((i/6))*10, 60+Math.floor((i/6))*10) ;
                        pieData.push({color: c, num: num, value: p, name: name});
                        legendData.push({fill:c.string, label:name});
                    });
                    this.data.legendData = legendData;
                    return pieData;
                },
            },
        },
    });
}
