import axios from "axios";
import { schemeGradient } from "crux/dist/color";
import { max } from "crux/dist/utils/math";
import * as d3 from "d3";
import * as _ from "lodash";
import { feature } from "topojson";


const width = 1060,
    height = 500,
    paddingB = 100,
    colors = {
        background: "white",
        activeStroke: "orange",
        iconStroke: "darkslateblue",
        rangeMin: "rgb(200,210,230)",
        rangeMax: "#3262a8",
    };

let scaleFactor = 1;

const scaleBarPos = d3.scaleLinear().range([0, 80])
.domain([1, 5]);

const svg = d3.select("#world-map")
            .append("svg:svg")
            .attr("width", width)
            .attr("height", height + paddingB);
// Define the div for the tooltip
const div = d3.select("#world-map").append("div")
            .attr("class", "tooltip")
            .style("events", "none")
            .style("opacity", 0);

svg.append("g").attr("id", "container");
const projection = d3.geoNaturalEarth1();
// const projection = d3.geoCylindricalStereographic();

const pathGenerator = d3.geoPath().projection(projection);
const g = d3.select("#container").append("g").attr("id", "zoom-area");
const otherG = d3.select("#container").append("g").attr("id", "other")
    .attr("transform", `translate(50, ${ height - 50})`);
const legendG = d3.select("#container").append("g").attr("id", "legend")
    .attr("transform", `translate(0, ${ height})`);
const zoomBarG = d3.select("#container").append("g").attr("id", "zoomBar")
    .attr("transform", `translate(${width - 100}, ${ height - 50})`);

// draw zoom indication bar
zoomBarG.append("polygon")
        .attr("id", "scaleAnchor")
        .attr("points", "0,0 10,0 5,10")
        .attr("transform", "translate(0,10)")
        .attr("fill", "#666");
const scaleTicks = [1, 2, 3, 4, 5];
zoomBarG.selectAll("line").data(scaleTicks)
    .enter()
    .append("line")
    .attr("stroke", "#000")
    .attr("y1", 20)
    .attr("y2", 15)
    .attr("x1", (d) => scaleBarPos(d) + 5)
    .attr("x2", (d) => scaleBarPos(d) + 5);
zoomBarG.selectAll("text").data(scaleTicks)
    .enter()
    .append("text")
    .attr("font-size", "11")
    .attr("y", 32)
    .attr("text-anchor", "middle")
    .text((d) => d)
    .attr("x", (d) => scaleBarPos(d) + 5);
zoomBarG.append("text")
        .attr("class", "fa help-text")
        .attr("font-family", "arial")
        .text("\uf059")
        .attr("font-size", "12").attr("x", 0).attr("y", 0)
        .style("fill", "#666");
zoomBarG.append("text")
        .attr("class", "help-text")
        .text("Zoom Scale: ")
        .attr("font-size", 11).attr("x", 13).attr("y", 0);
zoomBarG.selectAll("text.help-text").attr("cursor", "help")
    .on("mouseover", () => {
        div.transition()
            .duration(200)
            .style("opacity", 1);
        div.html(`<strong>Wheel to zoom in/out</strong><br>
                <strong>Click on blank space to reset</strong>`)
            .style("left", (d3.event.pageX + 15) + "px")
            .style("top", (d3.event.pageY + 15) + "px")
            .style("padding", "5px")
            .style("border-radius", "3px")
            .style("color", "white")
            .style("background-color", "rgba(50,50,50, 0.85)");
  }).on("mouseout", () => {
    div.transition()
        .duration(500)
        .style("opacity", 0);
  });
zoomBarG.append("line").attr("strokeWidth", 1)
        .attr("stroke", "#000").attr("x1", 5).attr("y1", 20)
        .attr("x2", 85).attr("y2", 20);

// gradient and legend
const gradientDef = svg.append("defs")
                .append("svg:linearGradient")
                .attr("id", "gradient")
                .attr("x1", "0%")
                .attr("y1", "100%")
                .attr("x2", "100%")
                .attr("y2", "100%")
                .attr("spreadMethod", "pad");
gradientDef.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colors.rangeMin)
        .attr("stop-opacity", 1);
gradientDef.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colors.rangeMax)
        .attr("stop-opacity", 1);

const grad = schemeGradient(colors.rangeMin, colors.rangeMax);

const reset = () => {
    g.transition().duration(50).call(
        zoom.transform,
        d3.zoomIdentity,
      );
};
d3.select("#container").append("rect").attr("width", width).attr("height", height).attr("stroke", "grey").attr("strokeWidth", 2).attr("fill", "none");
g.append("path")
    .attr("class", "sphere")
    .attr("d", pathGenerator({type: "Sphere"}))
    .attr("fill", colors.background)
    .on("click", reset);

axios.all([axios.get("/data/static_viz_data/world_map/countries-110m.json"), // topo info
        axios.get("/data/static_viz_data/world_map/country.tsv"), // database data
        axios.get("/data/static_viz_data/world_map/small-countries.txt"), // extreme small countries
    ])
  .then(axios.spread((topo, stat, small) => {
    // process data
    const temp = feature(topo.data, topo.data.objects.countries).features;
    const countries = Object.keys(temp).map(k => temp[k]);
    const data = d3.tsvParse(stat.data);
    const validCountries = data.map(x => x.country);
    const smallCountries = small.data.split(/\r?\n/)
                .filter(e => validCountries.indexOf(e) >= 0)
                .map(k => countries.find(x => x.properties.name === k));
    const dict = {};
    const numbers = [];
    data.forEach(x => {
        dict[x.country] = parseInt(x.number);
        numbers.push(parseInt(x.number));
    });

    // visualization functions
    const maxValue = max(numbers);
    const myScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([0, 1]);
    const getCountryFill = (d) => {
        const name = d.properties.name;
        if (dict[name]) return grad.get(myScale(dict[name]));
        else return "lightgrey";
    };
    const showTooltip = (d) => {
        div.transition()
                .duration(200)
                .style("opacity", 1);
        div.html(`<strong>Country: </strong><span class="details">${d.properties.name }
                <br></span><strong>Sample number: </strong><span class="details">${dict[d.properties.name] || "N/A"}</span>`)
            .style("left", (d3.event.pageX + 15) + "px")
            .style("top", (d3.event.pageY + 15) + "px")
            .style("padding", "5px")
            .style("border-radius", "3px")
            .style("color", "white")
            .style("background-color", "rgba(50,50,50, 0.85)");
    };
    const moveTooltip = () => {
        div.style("left", (d3.event.pageX + 15) + "px")
            .style("top", (d3.event.pageY + 15) + "px");
    };
    const hideTooltip = () => {
        div.transition()
            .duration(500)
            .style("opacity", 0);
    };
    const highlightCountry = (sel) => {
        d3.select(sel)
            .style("opacity", 1)
            .style("stroke", colors.activeStroke)
            .style("stroke-width", 2 / scaleFactor)
            .raise();
        d3.selectAll("text.fa").raise();
        g.transition()
            .duration(100);
    };
    const resetHighlight = (sel) => {
        d3.select(sel)
            .transition()
            .duration(100)
            .style("opacity", 0.9)
            .style("stroke", colors.background)
            .style("stroke-width", 1 / scaleFactor);
    };

    // draw legend
    legendG.append("rect")
        .attr("fill", "white")
        .attr("width", width)
        .attr("height", paddingB);
    legendG.append("rect")
            .style("fill", "url(#gradient)")
            .attr("x", 250)
            .attr("y", paddingB / 4)
            .attr("width", width - 500)
            .attr("height", paddingB / 5);
    legendG.append("text")
        .text("0")
        .attr("text-anchor", "end")
        .attr("x", 248)
        .attr("y", paddingB * 0.45 - 5);
    legendG.append("text")
        .text(maxValue)
        .attr("text-anchor", "start")
        .attr("x", width - 248)
        .attr("y", paddingB * 0.45 - 5);

    // draw country path
    g.selectAll("path.country").data(countries)
        .enter()
        .append("path")
        .attr("id", d => d.properties.name)
        .attr("class", "country")
        .attr("d", pathGenerator)
        .attr("fill", getCountryFill)
        .attr("opacity", 0.9)
        .attr("stroke", colors.background)
        .on("mouseover", function (d) {
            showTooltip(d);
            highlightCountry(this);
        })
        .on("mousemove", moveTooltip)
        .on("mouseout", function () {
            hideTooltip();
            resetHighlight(this);
        });

    // draw map labels for extreme small countries
    g.selectAll("text.label").data(smallCountries)
        .enter().append("text")
        .attr("class", "fa label")
        .attr("id", function (d) {
            const path = pathGenerator(d);
            const coord = path.split("L")[0].substring(1).split(",").map(x => parseFloat(x));
            d3.select(this).attr("x", coord[0]).attr("y", coord[1]);
            return d.properties.name;
        }).text("\uf3c5")
        .attr("font-size", "18px")
        .attr("text-anchor", "middle")
        .attr("cursor", "default")
        .attr("fill", getCountryFill)
        .attr("stroke", colors.iconStroke)
        .on("mouseover", function (d) {
            showTooltip(d);
            d3.select(this)
                .style("stroke", colors.activeStroke);
            highlightCountry(`path#${d.properties.name}`);
        })
        .on("mousemove", moveTooltip)
        .on("mouseout", function (d) {
            hideTooltip();
            d3.select(this)
                .style("stroke", colors.iconStroke);
            resetHighlight(`path#${d.properties.name}`);
        });

    // draw unknown cases
    if (!!dict["NULL"]) {
        otherG.append("text").text(`Unknown: ${dict["NULL"]}`)
          .attr("x", 0).attr("y", 20);
    }
  }));

// zoom interaction
const zoom = d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([1, 5])
    .translateExtent([[0, 0], [width, height]])
    .on("zoom", () => {
        scaleFactor =  d3.event.transform.k;
        g.selectAll("text.fa")
            .attr("stroke-width", `${1 / scaleFactor}px`)
            .attr("font-size", `${20 / scaleFactor}px`)
            .attr("white-space", function() {
                if (scaleFactor > 4) {
                    console.log(scaleFactor);
                    d3.select(this).attr("opacity", 0.3);
                } else {
                    d3.select(this).attr("opacity", 1);
                }
            });
        g.selectAll("path.country")
        .attr("stroke-width",  `${1 / scaleFactor}px`);
        g.attr("transform", d3.event.transform);
        const offsetX = scaleBarPos(d3.event.transform.k);
        d3.select("#scaleAnchor")
          .transition()
          .duration(100)
          .attr("transform", `translate(${offsetX}, 10)`);
    });

svg.call(zoom);
