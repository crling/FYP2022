<template>
    <div>
        <b-modal ref="modal" :title="`Edit Text: ${data.originalText}`" no-stacking no-fade centered ok-only @ok="updateData">
            <div style="max-height: 50vh; overflow: auto;">
                <b-input-group class="mt-1">
                    <b-form-input v-model="data.text" @change="isDirty = true" />
                    <b-input-group-append>
                        <b-button  variant="primary" @click="restore()">Restore</b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
        </b-modal>
    </div>
</template>

<script lang="ts">
import { event } from "crux/dist/utils";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class EditText extends Vue {
    data: any = {};
    isDirty = false;

    mounted() {
        event.on("edit-text-start", (_, d) => {
            this.data = {...d};
            this.isDirty = false;
            (this.$refs.modal as any).show();
        });
    }
    private restore() {
        this.data.text = this.data.originalText;
    }

    private updateData(e: Event) {
        if (!this.isDirty) return;
        event.emit("edit-text-done", {...this.data});
    }
}
</script>
