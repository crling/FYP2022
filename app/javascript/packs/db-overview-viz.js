import "viz/world-map";
import {initPage, catch_change} from "viz/overview";
import {data} from "viz/overview/overview-data.js"

var tids = "#tT0B0";

function init(tids){
    var main_id = "main";
    initPage(main_id, data, tids);
}

// init state (show first table and graph)
document.addEventListener('DOMContentLoaded', init(tids));
catch_change(data, tids);