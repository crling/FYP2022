import Vue, { VueConstructor } from "vue";

export function replace(id: string, vue: string | VueConstructor): Vue {
    const el = document.getElementById(id);
    if (!el) { return; }
    return new Vue({
        el,
        render: h => h(vue),
    });
}

export default function useVue(components: { [name: string]: string | VueConstructor}, condition: (() => boolean) | null = null) {
    const init = () => {
        if (typeof condition === "function" && !condition()) { return; }
        Object.keys(components).forEach(name => replace(name, components[name]));
    };
    // debugger;
    if (window.__turbolinks_loaded) {
        init();
    }
    document.addEventListener("DOMContentLoaded", init);
    document.addEventListener("turbolinks:load", init);
}
