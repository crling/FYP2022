import {init} from "viz/static_abd"
var path = window.gon.file;
var id = '#viz_sample_abd';

document.addEventListener('DOMContentLoaded', init(id, path));