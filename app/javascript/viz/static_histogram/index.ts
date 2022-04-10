import Oviz from "crux"
import template from "./template.bvt"

const color = "#3d8eff";

export function init(id, path, config) {
    console.log(config);
    const title = config["title"];
    const xlabel = config["xlabel"];
    const ylabel = config["ylabel"];
    Oviz.visualize({
        el: id,
        template,
        data: {color, xlabel, ylabel, title},
        loadData: {
            data: {
                url: path,
                type: "csv",
                dsvHasHeader: true,
                loaded(data) {
                    const xAxisKey = data.columns[0];
                    const yAxisKey = data.columns[1];
                    const result = [];
                    data.forEach(d => {
                        result.push([d[xAxisKey], d[yAxisKey]]);
                    });
                    const max = Math.max(...result.map(d=>parseInt(d[1])));
                    this.data.valueRange = [0, max]
                    return result.sort((a, b)=> a[yAxisKey]-b[yAxisKey]);
                },
            },

        }, 
    });
}
