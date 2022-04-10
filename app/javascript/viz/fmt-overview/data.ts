import { ColorScheme, ColorSchemeCategory, ColorSchemeGradient } from "crux/dist/color";
import { measuredTextSize } from "crux/dist/utils/text-size";
import { schemeSet1, schemeSet2, schemeSet3 } from "d3-scale-chromatic";
import { applyDefaultSpeciesSort } from "./editor";

import * as d3 from "d3";
import * as _ from "lodash";
import { getGroups } from "utils/array";

const schemeSets = [schemeSet1, schemeSet2, schemeSet3];

export const rainbowL = ["hsl(0, 73%, 80%)",
"hsl(36, 100%, 75%)",
// "hsl(45, 100%, 75%)",
"hsl(54, 90%, 72%)",
"hsl(66, 71%, 77%)",
"hsl(88, 50%, 76%)",
"hsl(122, 37%, 74%)",
"hsl(174, 42%, 65%)",
"hsl(187, 72%, 71%)",
"hsl(199, 92%, 74%)",
"hsl(231, 44%, 74%)",
"hsl(291, 47%, 71%)",
"hsl(340, 80%, 74%)",
];

const paletteColors = ["#c30", "#ffc", "#03c"];

export function main(data) {
    this.data.hiddenSpecies = new Set();
    this.data.species = this.data.filteredSpecies = getGroups(data, "Species").sort();
    this.data.maxSpeciesLength = Math.max(...this.data.filteredSpecies
                                        .map(x => measuredTextSize(x, 12).width));
    this.data.speciesCount = this.data.species.length;
    this.data.samples = getGroups(data, "Sample").sort();
    this.data.sources = getGroups(data, "Source").sort();
    this.data.mainDict = _.groupBy(data, "Sample");
    this.data.colorDict = {};
    const palette = d3.scaleLinear().domain([0, 1, 2]).range(paletteColors);
    this.data.sources.forEach((s, i) => {
        const value = i / this.data.sources.length * 2;
        this.data.colorDict[s] = palette(value);
    });
    computeSortingScore(this.data);
    return null;
}

export function computeSortingScore(data) {

    data.speciesSortingScore = {};
    data.species.forEach(s => {
        data.speciesSortingScore[s] = 0;
    });
    data.samples.forEach((s, i) => {
        const sampleWeight = Math.pow(0.5, i);
        if (!!data.mainDict[s]) {
            const groupedData = _.groupBy(data.mainDict[s], "Source");
            data.sources.forEach((k, j) => {
                const sourceWeight = 1 - j / data.sources.length;
                if (!!groupedData[k]) {
                    groupedData[k].forEach(x => {
                        data.speciesSortingScore[x.Species] += sampleWeight * sourceWeight * parseFloat(x.Abd) / 100;
                    });
                }
            });
            getGroups(data.mainDict[s], "Species").forEach(sp => {
                data.speciesSortingScore[sp] += Math.pow(0.5, i - 1);
            });
        }
    });
}

export function generateHistData(data) {
    const hist = {indexes: data.sources, result: {}, samples: []};
    data.samples.forEach(s => {
        if (!!data.mainDict[s]) {
            const groupedData = _.groupBy(data.mainDict[s], "Source");
            hist.result[s] = {};
            hist.indexes.forEach(k => {
                const species = [...data.filteredSpecies];
                if (!!groupedData[k]) {
                    hist.result[s][k] = [];
                    groupedData[k].forEach(x => {
                        if (species.indexOf(x.Species) >= 0) {
                            species.splice(species.indexOf(x.Species), 1);
                            hist.result[s][k].push([x.Species, parseFloat(x.Abd)]);
                        }
                    });
                    hist.result[s][k].push(...species.map(x => [x, 0 ]));
                    hist.result[s][k].sort((a, b) =>
                        data.filteredSpecies.indexOf(a[0]) - data.filteredSpecies.indexOf(b[0]));
                } else {
                    hist.result[s][k] = species.map(x => [x, 0 ]);
                }
            });
        }
    });
    hist.samples = Object.keys(hist.result);
    return hist;
}

export function meta(d) {
    this.data.metaFeatures = d.columns.slice(1, d.columns.length);
    this.data.metaDict = {};
    d.forEach(x => {
        const species = x[d.columns[0]];
        delete x[d.columns[0]];
        this.data.metaDict[species] = x;
    });
    this.data.metaData = {};
    this.data.metaInfo = {};
    let index = 0;
    this.data.metaFeatures.forEach(k => {
        // if (k === "Age" || k === "BMI") {
        //     const [min, max] = minmax(d.map(x => x[k]));
        //     this.data.metaInfo[k] = new MetaInfo(k, true, min, max, []);
        //     this.data.metaData[k] = this.data.samples.map(x => this.data.metaDict[x][k]);
        // } else {
        //     const values = d.map(x => x[k]).reduce((a, x) => {
        //         if (a.indexOf(x) < 0 && x !== "NA") a.push(x);
        //         return a;
        //     }, []);
        //     this.data.metaInfo[k] = new MetaInfo(k, false, null, null, values);
        //     this.data.metaData[k] = this.data.samples.map(x => this.data.metaDict[x][k]);
        // }
        const values = d.map(x => x[k]).reduce((a, x) => {
            if (a.indexOf(x) < 0 && x !== "NA") a.push(x);
            return a;
        }, []).sort();
        this.data.metaInfo[k] = new MetaInfo(k, schemeSets[index], false, null, null, values);
        this.data.metaData[k] = this.data.species.map(x => !!this.data.metaDict[x] ? this.data.metaDict[x][k] : "NA");
        index++;
    });
    applyDefaultSpeciesSort(this);
}

export class MetaInfo {
    public static keys = [
        "isNumber",
        "useNumber",
        "useGroup",
        "min",
        "max",
        "groupCount",
        "useThres",
        "thres",
        "minDistinct",
        "maxDistinct",
        "values",
        "colorMap",
        "colorStart",
        "colorEnd",
        "rangeMin",
        "rangeMax",
    ];
    public useNumber = false;
    public useGroup = false;
    public groupCount = 4;
    public useThres = false;
    public thres: number[] = [];
    public minDistinct = false;
    public maxDistinct = false;

    public rangeMin: number;
    public rangeMax: number;
    public colorStart = "#e5f0ff";
    public colorEnd = "#1a79ff";
    public colorMap: Record<string, string> = null;

    private simpleKey: string;
    private scheme: ColorScheme;

    constructor(public key: string, schemeSet, public isNumber: boolean, public min: number, public max: number, public values: string[]) {
        this.useNumber = isNumber;
        this.rangeMin = min;
        this.rangeMax = max;
        this.simpleKey = key.replace(/\(|\)| /g, "_");
        this.updateColorGetter(schemeSet);
    }

    public updateColorGetter(schemeSet) {
        if (this.colorMap === null && this.values) {
            this.colorMap = ColorSchemeCategory.create(this.values, schemeSet as string[]).colors;
        }
        if (this.useNumber) {
            let opt;
            if (this.useGroup) {
                if (this.useThres) {
                    opt = {
                        type: "threshold",
                        thresholds: this.thres,
                        domain: [this.min, this.max],
                        minDistinct: this.minDistinct,
                        maxDistinct: this.maxDistinct,
                    };
                } else {
                    opt = {
                        type: "quantize",
                        groups: this.groupCount,
                        domain: [this.min, this.max],
                    };
                }
            } else {
                opt = { type: "linear", domain: [this.rangeMin, this.rangeMax] };
            }
            this.scheme = ColorSchemeGradient.create(this.colorStart, this.colorEnd, opt);
            // v.defineGradient(`md_${this.simpleKey}`, "horizontal", [this.colorStart, this.colorEnd]);
        } else {
            this.scheme = new ColorSchemeCategory(this.colorMap);
        }
    }

    public color(c: number | string) {
        if (c === "NA") return null;
        return this.scheme.get(c);
    }

    public legendData() {
        if (this.useNumber && !this.useGroup) {
            return [null, `md_${this.simpleKey}`, this.rangeMin, this.rangeMax];
        }
        const lgData = this.scheme.legendData();
        return this.useNumber ? lgData : this.values.map(v => lgData.find(x => x.label === v));
    }

    public toObject() {
        const obj = { hasValues: !!this.values };
        for (const k of MetaInfo.keys) obj[k] = this[k];
        return obj;
    }

    public update(v: any, obj: any) {
        for (const k of MetaInfo.keys) {
            if (k === "thres" || (k === "values" && obj[k])) {
                this[k] = [...obj[k]];
            } else {
                this[k] = obj[k];
            }
        }
        // this.updateColorGetter();
    }
}

export function filterSpecies(v: any) {
    const hidden: Set<string> = v.data.hiddenSpecies;
    v.data.filteredSpecies = v.data.species.filter(s => !hidden.has(s));
    v.data.speciesCount = v.data.filteredSpecies.length;
    v.data.hist = generateHistData(v.data);
    Object.keys(v.data.metaData).forEach(k => {
        v.data.metaData[k] = v.data.filteredSpecies.map(x => !!v.data.metaDict[x] ? v.data.metaDict[x][k] : "NA");
    });
}
