<template>
    <div>
        <b-btn size="sm" @click="toggleModal(true)" block>Customize comments</b-btn>
        <b-modal ref="modal" title="Comments" @ok="apply" no-stacking no-fade centered>
            <div class="mb-1 text-danger small" v-if="isDirty">This page contains unapplied changes.</div>
            <draggable v-model="cmts" class="group-list" handle=".handle">
                <div v-for="(cmt, idx) in cmts" :key="idx" class="d-flex align-items-center">
                    <div class="group-item">
                        <draggable v-model="cmt.keys" class="group-container d-flex flex-wrap" group="gp" :move="moveCallback" @end="onEnd">
                            <div class="item m-1 p-1" v-for="d in cmt.keys" :key="d">{{d}}</div>
                        </draggable>
                        <div class="d-flex">
                            <div style="width:100%">
                                <div class="small text-muted mt-2 ml-2">Colors:</div>
                                <div class="d-flex flex-wrap">
                                    <div v-for="(color, k) in cmt.color" :key="k">
                                        <template v-if="!k.startsWith('__')">
                                            <b-button :id="`popover-cmt-${data.id}-${idx}-${k}`" :ref="`btn-${k}`" size="sm" class="m-1">
                                                {{k}}: <font :color="color">█</font>
                                            </b-button>
                                            <b-popover :target="`popover-cmt-${data.id}-${idx}-${k}`" placement="right" :triggers="['click', 'blur']">
                                                <picker :value="color" @input="updateColor(cmt.color, k, arguments[0].hex)" />
                                            </b-popover>
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <div style="width:100%" v-if="!cmt.isBool">
                                <div class="small text-muted my-2 ml-2">Value range:</div>
                                <div>
                                    <b-input-group size="sm">
                                        <b-input v-model.number="cmt.color.__min" @change="checkRange(cmt.color, true)"></b-input>
                                        <b-input v-model.number="cmt.color.__max" @change="checkRange(cmt.color, false)"></b-input>
                                    </b-input-group>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="handle p-1"><i class="fa fa-fw fa-align-justify"></i></div>
                </div>
            </draggable>
            <b-btn size="sm" @click="newGroup">New group</b-btn>
        </b-modal>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Sketch } from "vue-color";
import { Prop } from "vue-property-decorator";
import draggable from "vuedraggable";
import { copyObject } from "../../utils/object";

@Component({
    components: { "picker": Sketch, draggable },
})
export default class CommentEdit extends Vue {
    @Prop() public data: any;

    private cmts: any = [];
    private isDirty = false;

    public created() {
        this.cmts = this.data.colors.map((color, i) => {
            const keys = this.data.keys[i];
            return {
                color, keys,
                isBool: this.data.info[keys[0]].__isBool,
            };
        });
    }

    private toggleModal(show: boolean) {
        (this.$refs.modal as any)[show ? "show" : "hide"]();
        this.$forceUpdate();
    }

    private updateColor(keys, k, color) {
        keys[k] = color;
        this.isDirty = true;
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

    private moveCallback(evt) {
        if (evt.from === evt.to) return;
        const item = evt.draggedContext.element;
        const distArray = evt.relatedContext.list;
        if (distArray.length === 0) return true;
        return this.data.info[item].__isBool === this.data.info[distArray[0]].__isBool;
    }

    private newGroup() {
        this.cmts.push({
            color: this.createColorDef(true),
            isBool: true,
            keys: [],
        });
        this.isDirty = true;
    }

    private onEnd() {
        this.cmts = this.cmts.filter(c => c.keys.length);
        this.cmts.forEach(cmt => {
            const isBool = this.data.info[cmt.keys[0]].__isBool;
            if (isBool !== cmt.isBool) {
                cmt.color = this.createColorDef(isBool);
                cmt.isBool = isBool;
            }
            if (!isBool && cmt.keys.length) {
                const min = Math.min(...cmt.keys.map(k => this.data.info[k].__min));
                const max = Math.max(...cmt.keys.map(k => this.data.info[k].__max));
                cmt.color.__min = min;
                cmt.color.__max = max;
            }
        });
        this.isDirty = true;
    }

    private apply() {
        this.data.callback(this.cmts.map(copyObject));
        this.isDirty = false;
    }

    private createColorDef(bool = false, keys: string[] = null) {
        return bool ? {
            Y: "#4dafff",
            N: "#aaacae",
        } : {
            Start: "#e5f0ff",
            End: "#1a79ff",
        };
    }
}
</script>

<style lang="scss" scoped>
hr {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}
    
.handle {
    cursor: pointer;
}
    
.group-item {
    margin-bottom: 1rem;
    width: 100%;
    padding: 6px;
    border-radius: 3px;
    border: 1px solid rgba(255,255,255,.1);
}
    
.group-container {
    padding: 6px;
    border-radius: 3px;
    border: 1px dashed rgba(255,255,255,.2);
    background: rgba(255,255,255,.1);
}
.item {
    background: #6c757d;
    cursor: pointer;
    border-radius: 4px;
}
</style>