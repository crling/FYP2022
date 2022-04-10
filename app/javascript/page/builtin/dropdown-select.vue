<template>
     <b-dropdown right="right" :size="size" class="sl-dropdown" toggle-class="btn-block dropdown-toggle" boundary="window">
        <template slot="button-content">
            <div class="d-flex justify-content-between">
                <div class="sl-label"><slot name="label" v-bind:opt="chosenOption">{{title}}</slot></div>
                <span><i class="fa fa-caret-down"></i></span>
            </div>
        </template>
        <b-dropdown-item v-for="opt in options" :key="opt.key || opt.value" :disabled="opt.disabled" :active="realValue === opt.value" @click="chosen(opt)">
            <slot v-bind:opt="opt">{{opt.text}}<small class="text-muted ml-2">{{opt.secondaryText}}</small></slot>
        </b-dropdown-item>
    </b-dropdown>
</template>

<script lang="ts">
    import Vue, { Component, pd } from "../vue";

    interface Option {
        text: string;
        value: string | number;
    }

    @Component({
        name: "dropdown-select",
    })
    export default class DropDownSelect extends Vue {

        public chosenOption: Option = null;

        @pd.Prop() public value: undefined;
        @pd.Prop() public options: Option[];
        @pd.Prop() public size: string;
        @pd.Prop({ default: false }) public right: boolean;
        @pd.Prop() public defaultValue: undefined;

        get title() {
            const opt = this.options.find(o => o.value === this.realValue);
            if (opt) {
                this.chosenOption = opt;
                return opt.text;
            } else {
                return "--- Please choose ---";
            }
        }

        get realValue() {
            if (typeof this.defaultValue !== "undefined" && typeof this.value === "undefined") {
                return this.defaultValue;
            }
            return this.value;
        }

        public updateValue() {
            this.$emit("input", this.chosenOption.value);
        }

        public chosen(opt) {
            this.chosenOption = opt;
            this.updateValue();
        }
    }
</script>

<style scoped lang="scss">
.dropdown-item :active :hover{
        outline: none
}
    
.dropdown-item :active :hover .text-muted{
    color: #ddd !important
}
            
.fa {
    margin: 0 0 0 1em;
}
.sl-dropdown /deep/ .dropdown-toggle {
  max-width: 100%;
}
.sl-dropdown /deep/ .dropdown-toggle::after {
  display: none;
}
.sl-label{
    overflow: hidden;
}
    
</style>