import BootstrapVue from "bootstrap-vue";
import _Vue, { VueConstructor } from "vue";
import _Component from "vue-class-component";
import * as _pd from "vue-property-decorator";

declare global {
    interface Window {
        __BVD3_vue: VueConstructor;
    }
}

if (!window.__BVD3_vue) {
    window.__BVD3_vue = _Vue;
}

// tslint:disable
const Vue = window.__BVD3_vue;

export default Vue;
export const Component = _Component;
export const pd = _pd;
