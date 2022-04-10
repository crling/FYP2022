<template>
    <div>
        <b-btn size="sm" @click="toggleModal(true)" block>{{ data.title || 'Reorder' }}</b-btn>
        <b-modal ref="modal" :title="data.title || 'Reorder'" @ok="apply" no-stacking no-fade centered>
            <draggable v-if="data.compact" v-model="array" class="compact-container d-flex flex-wrap">
                <div class="item m-1 p-1" v-for="d in array" :key="d">
                    <span class="text-light">{{d}}</span>
                </div>
            </draggable>
            <draggable v-else v-model="array" class="list-group">
                <div class="list-group-item" v-for="d in array" :key="d">
                    <span>{{d}}</span>
                    <!-- <p class="text-light">{{d}}</p> -->
                </div>
            </draggable>
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
export default class Reorder extends Vue {
    @Prop() public data: any;
    private array: any[] = [];

    public created() {
        this.array.push(...this.data.array);
    }

    private toggleModal(show: boolean) {
        (this.$refs.modal as any)[show ? "show" : "hide"]();
        if (this.data.needAutoUpdate) {
            this.array.length = 0;
            this.array.push(...this.data.array);
        } else {
            this.$forceUpdate();
        }
    }

    private apply() {
        this.data.callback(Array.from(this.array));
    }
}
</script>

<style lang="scss" scoped>
.compact-container .item {
    background: #6c757d;
    cursor: pointer;
    border-radius: 4px;
}
</style>
