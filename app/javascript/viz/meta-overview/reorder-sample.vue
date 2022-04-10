<template>
    <div>
        <b-btn size="sm" @click="toggleModal(true)" block>Reorder samples</b-btn>
        <b-modal ref="modal" title="Reorder samples" @ok="apply" no-stacking no-fade centered>
            <div v-for="(key, index) in data.keys" :key="index" class="mb-1">
                <div v-if="index">Then:</div>
                <div v-else>Sort by:</div>
                <b-input-group class="mt-1">
                    <b-form-select v-model="data.keys[index]" :options="data.options" />
                    <b-input-group-append>
                        <b-button
                            variant="danger"
                            :disabled="data.keys.length === 1"
                            @click="$delete(data.keys, index)"
                        >
                            Remove
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
            <b-btn @click="data.keys.push('aid')" class="mt-3" size="sm">Add criteria</b-btn>
        </b-modal>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import draggable from "vuedraggable";

@Component({
    components: { draggable },
})
export default class ReorderSample extends Vue {
    @Prop() public data: any;

    private bisecPosGroup = [];
    private bisecNegGroup = [];
    private bisecRows = "0";
    private sortPos = true;
    private sortNeg = false;

    private toggleModal(show: boolean) {
        (this.$refs.modal as any)[show ? "show" : "hide"]();
        this.$nextTick(() => {
            this.$forceUpdate();
        });
    }

    private get showBisecSettings() {
        return this.data.keys.some(k => k === "abis" || k === "dbis");
    }

    private apply() {
        this.data.callback(
            this.data.keys,
            Array.from(this.bisecNegGroup),
            Array.from(this.bisecPosGroup),
            this.bisecRows,
            this.sortPos,
            this.sortNeg,
        );
    }
}
</script>

<style lang="scss" scoped>
hr {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}
    
.item-wrapper {
    width: 100%;
    align-self: stretch;
}

.item-wrapper :first-child {
    padding-right: 4px;
}
.item-wrapper :last-child {
        padding-left: 4px;
}
.item-frame {
    padding: 6px;
    border-radius: 3px;
    border: 1px solid rgba(255,255,255,.1);
}
    
.item, .item-s {
    font-size: 12px;
    background: #6c757d;
    border-radius: 4px;
}

.item {
    cursor: pointer;
}
    
</style>
