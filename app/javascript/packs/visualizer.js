
import { call, viz_mode } from "page/visualizers";
import { event } from "crux/dist/utils";

let vizLoaded = false;
let canvasMounted = false;
let packLoaded = false;
let currViz = null;
let outputsLoaded = false;

function checkResource() {
    const moduleName = window.gon.module_name;
    if (window.__BVD3_visualizers[moduleName]) {
        packLoaded = true;
    }
    if (document.getElementById("canvas")) {
        canvasMounted = true;
    }
    if (packLoaded && canvasMounted && !vizLoaded) {
        if (window.gon.viz_mode === viz_mode.TASK_OUTPUT && !outputsLoaded) return;
        vizLoaded = true;
        const v = call(moduleName);
        if (Array.isArray(v)) {
            const [v_, opt] = v;
            currViz = v_;
        } else {
            if (v) currViz = v;
        }
    }
}

event.on(event.CANVAS_READY, () => { 
    canvasMounted = true; checkResource();
});
event.on("bvd3-resource-loaded", () => { 
    packLoaded = true; 
    checkResource(); 
});
event.on("GMT:query-finished", ()=> {
    outputsLoaded = true;
    checkResource();
});
event.on("GMT:reset-query", () => {
    const canvas = document.getElementById("canvas");
    if (!canvas) { return; }
    const svgElm = canvas.getElementsByTagName("svg");
    if (svgElm.length) svgElm[0].remove();
    const canvasElm = canvas.getElementsByTagName("canvas");
    if (canvasElm.length) canvasElm[0].remove();
    packLoaded = false;
    canvasMounted = false;
    vizLoaded = false;
    outputsLoaded = false;
});
document.addEventListener("turbolinks:before-cache", () => {
    const canvas = document.getElementById("canvas");
    if (!canvas) { return; }
    const svgElm = canvas.getElementsByTagName("svg");
    if (svgElm.length) svgElm[0].remove();
    const canvasElm = canvas.getElementsByTagName("canvas");
    if (canvasElm.length) canvasElm[0].remove();
    packLoaded = false;
    canvasMounted = false;
    vizLoaded = false;
    outputsLoaded = false;
});

