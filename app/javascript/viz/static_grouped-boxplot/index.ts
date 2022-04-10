import Oviz from "crux";
import { groupedChartColors} from "oviz-common/palette";
import { findBoundsForValues } from "utils/maths";
import template from "./template.bvt";

const ylabel = "Relative abundance(log10)";
const classifiedIndex = 0;
const title = "grouped box plot";

export function init(id, path, config) {
    Oviz.visualize({
        el: id,
        template,
        data: {ylabel, title,
            config: {
                plotWidth: 1000,
                showOutliers: true,
                fontSize: 14,
            },
            xAxisRotation: 35,
            deltaX: 0,
            colors: ["#7DCEA0", "#F1948A", "#85C1E9"],
            adjustLabel(ev, el, delta, cuur) {
                this.xAxisRotation = cuur[0] * 180 / Math.PI;
                this.clipPath = this.getClipPath();
                this.redraw();
            },
            getClipPath() {
                const delta = -150 / Math.tan(this.xAxisRotation * Math.PI / 180);
                return [0, 0, 0, 400, delta, 550, 850 + delta, 550, 850, 400, 850, 0];
            },
            state: {
                rangeL: 0,
                // rangeR: 0,
            },
            updateRange(range: [number, number]) {
                this.setState({ rangeL: range[0]});
            },
        },
        loadData: {
            data: {
                url: path,
                type: "tsv",
                dsvHasHeader: true,
                loaded(data) {
                    // 這個版本是只有兩個分組， e.g. healthy - crc
                    const categories = data.columns.slice(1);
                    const classifiedKey = data.columns[classifiedIndex];
                    const classifications = data.map(d => (d[classifiedKey])).filter((item, index, self) => {
                        return self.indexOf(item) === index; });
                    const boxData = [{values: [], outliers: [], means: [], categories}, {values: [], outliers: [], means: [], categories}];
                    const allValues = [];
                    categories.forEach((arr, i) => {
                        const initialData = [[], []];
                        data.forEach(d => {
                            allValues.push(parseFloat(d[arr]));
                            if (d[classifiedKey] === classifications[0]) {
                                initialData[0].push(parseFloat(d[arr]));
                            } else {
                                initialData[1].push(parseFloat(d[arr]));
                            }
                        });
                        classifications.forEach((classification, j) => {
                            const result = [];
                            const stat1 = new Oviz.algo.Statistics(initialData[j]);
                            const interQuartileRange = stat1.Q3() - stat1.Q1();
                            initialData[j].forEach(d => {
                                if ((d < stat1.Q3() - 1.5 * interQuartileRange) || (d > stat1.Q3() + 1.5 * interQuartileRange))  {
                                    boxData[j].outliers.push([i, d]);
                                } else {
                                    result.push(d);
                                }
                            });
                            const stat2 = new Oviz.algo.Statistics(result);
                            boxData[j].values.push([stat2.min(), stat2.Q1(), stat2.median(), stat2.Q3(), stat2.max()]);
                            boxData[j].means.push(stat2.mean());
                        });
                    });
                    this.data.valueRange = findBoundsForValues(allValues, 2, false, 0.5);
                    this.data.boxData = {};
                    boxData.forEach((x, i) => {
                        this.data.boxData[`boxData${i}`] = x;
                    });
                    this.data.classifications = classifications;
                    this.data.categories = categories;
                    return null;
                },
            },
        },
        setup() {
            if (this.data.categories.length <= 5) {
                this.data.boxW = 40;
            } else if (this.data.categories.length <= 10) {
                this.data.boxW = 30;
            } else {
                this.data.boxW = 20;
            }
            const gridW = (this.data.boxW * this.data.classifications.length) / 0.8;
            this.data.plotWidth = this.data.categories.length * gridW;
            this.data.gridW = gridW;
            this.size.width = this.data.plotWidth > 850 ? 1000 : this.data.plotWidth + 150;
            this.data.rectW = this.size.width - 150;
            this.data.clipPath = this.data.getClipPath();
        },
    });
}
