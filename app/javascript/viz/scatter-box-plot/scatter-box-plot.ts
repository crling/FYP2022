import Oviz from "crux";
import template from "./template.bvt";

export class ScatterBoxPlot extends Oviz.Component {

    public groups;
    public scatterData;
    public groupDict;
    public colorGetter;
    public xRange;
    public yRange;
    public shapes;
    public xLabel;
    public yLabel;
    public ageDiv;

    public data;

    public metaFeatures;

    public render() {
        return this.t`${template}`;
    }

    // public willRender() {
    //     console.log(this.data);
    // }
}
