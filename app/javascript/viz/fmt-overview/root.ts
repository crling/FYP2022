import Oviz from "crux";
import template from "./template.bvt";

export class FMT extends Oviz.Component {
    public gridW;
    public speciesCount;
    public maxSpeciesLength: number;
    public mainSizeChanged = true;
    public plotHeight: number;
    public metaFeatures: any[];
    public hist: any;

    protected mainWidth;
    protected offsetY = 30;
    protected offsetX: number;
    protected centerX: number;
    protected title: string = "Double click me to add your title";
    public render() {
        return this.t`${template}`;
    }
    public willRender() {
        if (this._firstRender) {
            this.offsetX = this.maxSpeciesLength * Math.cos(Math.PI / 4);
        }
        if (this.mainSizeChanged) {
            this.mainWidth = this.speciesCount * this.gridW;
            this.$v.size.width = this.mainWidth + this.offsetX + 300;
            this.centerX = this.mainWidth / 2 + this.offsetX;
            this.$v.size.height = this.hist.samples.length * this.plotHeight
                + 12 * this.metaFeatures.length + this.offsetY + this.maxSpeciesLength;
            this.mainSizeChanged = false;
        }
    }
}
