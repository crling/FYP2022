<template>
    <div>
        <b-btn size="sm" @click="toggleModal(true)" block>{{ data.title || 'Customize color' }}</b-btn>
        <b-modal ref="modal" :title="data.title || 'Customize color'" @ok="apply" no-stacking no-fade centered>
            <template v-if="data.palettes">
                <div class="pt-2 pb-1">
                    <div class="pb-2">Color palette:</div>
                    <dropdown-select size="sm" style="width: 100%" :options="paletteOptions" v-model="palette">
                        <template v-slot:label="v">
                            <span>{{v.opt.data.name}}</span>
                            <span class="ml-2">
                                <span v-for="(color, idx) in distinct(v.opt.data.colors)" :key="idx" :style="`background:${color};`">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            </span>
                        </template>
                        <template v-slot:default="o">
                            <div style="width: 300px" class="d-flex justify-content-between">
                                <span>{{o.opt.data.name}}</span>
                                <span class="ml-2">
                                    <span v-for="(color, idx) in distinct(o.opt.data.colors)" :key="idx" :style="`background:${color};`">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </span>
                            </div>
                        </template>
                    </dropdown-select>
                    <div class="mt-3 small text-muted">Color palettes other than "Default" are not optimized for the dark theme. Please consider using light themes.</div>
                </div>
                <div style="margin:0 -1rem;"><hr></div>
            </template>
            <div class="d-flex flex-wrap">
                <div v-for="(color, key) in data.scheme" :key="key">
                    <template v-if="shouldShowKey(key)">
                        <b-button :id="`popover-${data.id}-${key}`" :ref="`btn-${key}`" size="sm" class="m-1">
                            {{keyDisplayName(key)}} <font :color="data.scheme[key]">█</font>
                        </b-button>
                        <b-popover :target="`popover-${data.id}-${key}`" placement="right" :triggers="['click', 'blur']">
                            <picker :value="color" @input="updateColor(key, arguments[0].hex)" :presetColors="currentColors" />
                        </b-popover>
                    </template>
                </div>
            </div>
            <div v-if="data.naColor" class="mt-2">
                <b-button :id="`popover-na`" :ref="`btn-na`" size="sm" class="m-1">
                    Color for N/A <font :color="data.naColor">█</font>
                </b-button>
                <b-popover :target="`popover-na`" placement="right" :triggers="['click', 'blur']">
                    <picker :value="data.naColor" @input="data.naColor = arguments[0].hex" :presetColors="currentColors" />
                </b-popover>
            </div>
            <div class="mt-2" style="width:50%" v-if="'__min' in data.scheme">
                <div class="small text-muted my-2 ml-2">Value range:</div>
                <div>
                    <b-input-group size="sm">
                        <b-input v-model.number="data.scheme.__min" @change="checkRange(data.scheme, true)"></b-input>
                        <b-input v-model.number="data.scheme.__max" @change="checkRange(data.scheme, false)"></b-input>
                    </b-input-group>
                </div>
            </div>
            <div class="mt-3 small text-muted" v-if="hasThemeDependentColors">Some colors are only applied to the current theme.</div>
        </b-modal>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Sketch } from "vue-color";
import { Prop, Watch } from "vue-property-decorator";
import DropdownSelect from "page/builtin/dropdown-select.vue";
import { copyObject } from "utils/object";

@Component({
    components: { "picker": Sketch, "dropdown-select": DropdownSelect },
})
export default class ColorPicker extends Vue {
    @Prop() public data: any;

    private palette = "default";
    private defaultScheme: Record<string, string>;

    private isDark = false;
    private hasThemeDependentColors = false;

    public mounted() {
        this.defaultScheme = {};

        Object.keys(this.data.scheme).forEach(k => {
            if (this.data.scheme[k] === null) {
                this.data.scheme[k] = "#fff";
            } else {
                this.defaultScheme[k] = this.data.scheme[k];
            }
        });
    }

    private get paletteOptions() {
        return Object.entries(this.data.palettes).map(([value, data]) => ({ data, value }));
    }

    private get currentColors() {
        if (this.data.palettes && this.palette) {
            return this.distinct(this.data.palettes[this.palette].colors);
        } else {
            return null;
        }
    }

    private distinct(colors: string[]) {
        return [...new Set(colors)];
    }

    private shouldShowKey(key: string) {
        if (key.startsWith("__")) return false;
        if (this.isDark) {
            if (key.endsWith("(light theme)")) return false;
        } else {
            if (key.endsWith("(dark theme)")) return false;
        }
        return true;
    }

    private keyDisplayName(key: string) {
        if (this.data.names) return this.data.names[key];
        if (key.endsWith("theme)")) {
            return key.substring(0, key.lastIndexOf(" ("));
        }
        return key;
    }

    @Watch("palette")
    private paletteUpdated() {
        const colors = this.currentColors;
        if (this.palette === "default") {
            Object.entries(this.defaultScheme).forEach(([name, value]) => {
                this.data.scheme[name] = value;
            });
        } else {
            Object.entries(this.data.paletteMap as Dictionary<number|string>).forEach(([name, idx]) => {
                if (typeof idx === "number") {
                    this.data.scheme[name] = colors[idx];
                } else  {
                    this.data.scheme[name] = idx;
                }
            });
        }
        this.$forceUpdate();
    }

    private toggleModal(show: boolean) {
        this.hasThemeDependentColors = Object.keys(this.data.scheme).some(k => k.endsWith("theme)"));
        (this.$refs.modal as any)[show ? "show" : "hide"]();
    }

    private updateColor(key, color) {
        this.data.scheme[key] = color;
        this.$forceUpdate();
    }

    private checkRange(data, isMin) {
        if (data.__min >= data.__max) {
            alert("Invalid range.");
            this.$nextTick(() => {
                if (isMin)
                    data.__min = data.__max - 1;
                else
                    data.__max = data.__min + 1;
                this.$forceUpdate();
            });
        }
    }

    private apply() {
        this.data.callback(copyObject(this.data.scheme), this.data.naColor);
    }

    public updateNAColor(color) {
        this.data.naColor = color;
    }
}
</script>

<style lang="scss" scoped>
hr {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>