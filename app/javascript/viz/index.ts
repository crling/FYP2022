// export interface Viz {
//     vizOpts: any;
// }
import { registerBoxplot} from "./boxplot";
import { registerBoxplotSingle } from "./boxplot-single";
import { registerCorrHeatmap } from "./corr-heatmap";
import { registerGroupedBoxP } from "./grouped-boxplot-p";
import { registerHierTree} from "./hier-tree";
import { registerScatterBoxPlot } from "./scatter-box-plot";
import { registerScatterplot} from "./scatterplot";

declare global {
    interface GonInfo {
        urls?: any;
        required_data?: any;
        module_name?: string;
    }
    interface Window {
        gon: GonInfo;
    }
}
export function registerViz(moduleName) {
    switch (moduleName) {
        case "corr-heatmap":
            registerCorrHeatmap();
            break;
        case "scatterplot":
            registerScatterplot();
            break;
        case "scatter-box-plot":
            registerScatterBoxPlot();
            break;
        case "boxplot":
            registerBoxplot();
            break;
        case "boxplot-single":
            registerBoxplotSingle();
            break;
        case "hier-tree":
            registerHierTree();
            break;
        case "grouped-boxplot-p":
            registerGroupedBoxP();
            break;

    }

}
