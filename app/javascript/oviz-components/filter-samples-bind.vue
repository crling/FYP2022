<template>
    <div>
        <b-btn size="sm" @click="toggleModal(true)" block>{{ data.title }}</b-btn>
        <b-modal size="lg" ref="modal" :title="data.title" @ok="apply" no-stacking no-fade centered>
            <div><a href="#" @click.prevent="showAll()">Show All</a></div>
            <div class="d-flex flex-wrap sample-container">
                <div v-for="sample in data.samples" :key="sample.sampleId" class="mb-1 mr-2">
                    <b-checkbox v-model="sample.show">{{ sample.sampleId }}</b-checkbox>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import draggable from "vuedraggable";

@Component
export default class FilterSamplesBind extends Vue {
    @Prop() public data: {
        title: string,
        samples: {sampleId: string, show: boolean}[],
    };

    private toggleModal(show: boolean) {
        (this.$refs.modal as any)[show ? "show" : "hide"]();
        this.$nextTick(() => {
            this.$forceUpdate();
        });
    }

    private showAll() {
        this.data.samples.forEach(d => d.show = true);
        console.log("eeee");
        this.$nextTick(() => {
            this.$forceUpdate();
        });
    }

    private apply() {
        this.data.callback(this.data.samples);
    }
}
</script>

<style lang="scss" scoped>
.sample-container {
    max-height: 50vh;
    overflow: auto;
}
    
</style>
