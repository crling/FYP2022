import Vue from "vue";

import VApp from "page/vapp.vue";

import EditText from "oviz-components/edit-text-vue.vue";
import FilterSamplesBind from "oviz-components/filter-samples-bind.vue";

import ColorPicker from "page/builtin/color-picker.vue";
import SectionFiles from "page/builtin/section-files.vue";
import FilterSamples from "viz/fmt-overview/filter-samples.vue";
import ReorderSpecies from "viz/fmt-overview/reorder-species.vue";
import MetaInfo from "viz/meta-overview/meta-info.vue";
import ReorderSample from "viz/meta-overview/reorder-sample.vue";
import Reorder from "viz/meta-overview/reorder.vue";

Vue.component("reorder", Reorder);
Vue.component("filter-samples", FilterSamples);
Vue.component("filter-samples-bind", FilterSamplesBind);
Vue.component("reorder-sample", ReorderSample);
Vue.component("color-picker", ColorPicker);
Vue.component("section-files", SectionFiles);
Vue.component("reorder-species", ReorderSpecies);
Vue.component("meta-info", MetaInfo);

function initVApp() {
    if (document.getElementById("vapp")) {
        const vapp = new Vue({
            el: document.getElementById("vapp"),
            render: h => h(VApp),
        });
        const div = document.createElement("div");
        div.setAttribute("id", "edit-text");
        const _ = new Vue({
            el: "#edit-text",
            render: h => h(EditText),
        });
    }
}

document.addEventListener("turbolinks:load", initVApp);
document.addEventListener("DOMContentLoaded", initVApp);
