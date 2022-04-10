<template>
    <div>
        <div class="list-group">
            <div class="list-group-item">
                <b-btn variant="primary" size="sm" block @click="apply">Apply Changes</b-btn>
            </div>
            <div v-for="d in data.data" :key="d.name" class="list-group-item">
                <div class="title"><b>{{d.name}}</b></div>
                <div v-if="d.isNumber && d.hasValues" class="form-check mt-2">
                    <input type="checkbox" class="form-check-input" :id="`in-${d.name}`" v-model="d.useNumber" @change="markDirty(d.name)">
                    <label class="form-check-label" :for="`in-${d.name}`">Is continuous number</label>
                </div>
                <div v-if="d.useNumber" class="mt-2">
                    <div class="form-check">
                        <label class="form-check-label">
                            <input type="checkbox" class="form-check-input" v-model="d.useGroup" @change="markDirty(d.name)">
                            Use groups
                        </label>
                    </div>
                    <div v-if="d.useGroup" class="mt-2">
                        <div class="form-check">
                            <label class="form-check-label">
                                <input type="checkbox" class="form-check-input"  v-model="d.useThres" @change="markDirty(d.name)">
                                Custom ranges for groups
                            </label>
                        </div>
                        <div class="mt-2" v-if="d.useThres">
                            <b-input-group size="sm">
                                <b-form-input :value="d.min" size="sm" disabled />
                                <b-input-group-append is-text>
                                    <label class="m-0"><input type="checkbox" v-model="d.minDistinct" class="mr-1" @change="markDirty(d.name)" /> Distinct</label>
                                </b-input-group-append>
                            </b-input-group>
                            <b-input-group v-for="(t, i) in d.thres" :key="i" size="sm">
                                <b-form-input v-model.number="d.thres[i]" size="sm" @change="markDirty(d.name)" />
                                <b-input-group-append>
                                    <b-btn @click="$delete(d.thres, i); markDirty(d.name)">Remove</b-btn>
                                </b-input-group-append>
                            </b-input-group>
                            <b-input-group size="sm">
                            <b-form-input :value="d.max" size="sm" disabled />
                                <b-input-group-append is-text>
                                    <label class="m-0"><input type="checkbox" v-model="d.maxDistinct" class="mr-1" @change="markDirty(d.name)" /> Distinct</label>
                                </b-input-group-append>
                            </b-input-group>
                            <b-btn size="sm" class="mt-1" @click="d.thres.push(0); markDirty(d.name)">Add threshold</b-btn>
                        </div>
                        <div class="mt-2" v-else>
                            <b-input-group size="sm" prepend="Num of groups">
                                <b-form-input v-model.number="d.groupCount" @change="markDirty(d.name)"></b-form-input>
                            </b-input-group>
                        </div>
                    </div>
                    <div class="mt-2 d-flex">
                        <color-picker :data="cpGProp(d)"/>
                    </div>
                </div>
                <div v-else class="mt-2 d-flex">
                    <div class="mr-2">
                        <reorder :data="reorderProp(d)"/>
                    </div>
                    <div class="mr-2">
                        <color-picker :data="cpProp(d)"/>
                    </div>
                </div>
                <div class="mt-1 text-danger small" v-if="dirtyGroup === d.name">Settings changed. Please click "Apply Changes".</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import ColorPicker from "page/builtin/color-picker.vue";
import Reorder from "./reorder.vue";

@Component({
    components: { Reorder, ColorPicker },
})
export default class MetaInfo extends Vue {
    @Prop() public data: any;
    private dirtyGroup = null;

    private reorderProp(d: any) {
        return {
            title: "Reorder categories",
            array: d.values,
            callback: v => {
                d.values = v;
                this.dirtyGroup = d.name;
            },
        };
    }

    private cpProp(d: any) {
        return {
            id: `m-${d.name}`,
            title: "Set colors",
            scheme: d.colorMap,
            callback: (scheme) => {
                d.colorMap = scheme;
                this.dirtyGroup = d.name;
            },
        };
    }

    private cpGProp(d: any) {
        return {
            id: `m-${d.name}`,
            title: "Set colors",
            scheme: {
                Start: d.colorStart,
                End: d.colorEnd,
                ...(
                    d.useGroup ? {} : {
                        __min: d.rangeMin,
                        __max: d.rangeMax,
                    }
                ),
            },
            callback: (scheme) => {
                d.colorStart = scheme.Start;
                d.colorEnd = scheme.End;
                if (!d.useGroup) {
                    d.rangeMin = scheme.__min;
                    d.rangeMax = scheme.__max;
                }
                this.dirtyGroup = d.name;
            },
        };
    }

    private markDirty(gp) {
        this.dirtyGroup = gp;
    }

    private apply() {
        this.data.callback(this.data.data);
        this.dirtyGroup = null;
    }
}
</script>

<style lang="scss" scoped>
.title b {
    border-bottom: 1px solid #00c6ff;
}
</style>