<template>
     <div id = "vapp" :class= "{'ana': isAnalysis, 'task': !isAnalysis}"> 
        <div id="tool-bar">
            <div v-if= "isAnalysis">
                <b-button @click="downloadSVG" class="tool-bar-el"><i class="fa fa-download"></i>Download Chart</b-button>
                <b-button @click="useDemoFiles" class="tool-bar-el">Use Demo</b-button>
                <dropdown-select
                    right
                    v-model="chosenOutput"
                    :options="taskOutputs"
                    :variant="outline"
                    class="tool-bar-el"/>
                <b-button @click="downloadDemoFiles" class="tool-bar-el"><i class="far fa-file-archive"></i>Download Data</b-button>
                <b-button id="editor-conf" @click="toggleEditor">Editor</b-button>
            </div>
            <div v-else>
                <b-button @click="downloadSVG" class="tool-bar-el"><i class="fa fa-download"/>Download Chart</b-button>
                <b-button @click="downloadDemoFiles" class="tool-bar-el"><i class="far fa-file-archive"></i>Download Data</b-button>
                <b-button id="editor-conf" @click="toggleEditor">Editor</b-button>
            </div>
        </div>
        <div id="viz-container">
            <div class="need-upload w-100" v-if="isLoading">
                <i class="fas fa-circle-notch fa-spin fa-5x m-0"></i>
                <h4 class="mt-4">Loading data……</h4>
            </div>
            <div id="canvas"/>
            <div id="v-editor" v-show="showEditor">
                <OvizEditor :config = "conf" :editorWidth = "280"/>
                <b-modal id="msg-box-modal" ref="msgBox" :title="msgBoxTitle">
                    <p v-if="msgBoxUseHTML" class="my-2" v-html="msgBoxContent"></p>
                    <p v-else class="my-2">
                        <pre>{{msgBoxContent}}</pre>
                </p>
            </b-modal>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import BootstrapVue from 'bootstrap-vue';
    import OvizEditor from "oviz-editor";

    import axios from "axios";
    import { event } from "crux/dist/utils";
    import {viz_mode} from "page/visualizers";

    import DropDownSelect from "page/builtin/dropdown-select.vue";

    Vue.use(OvizEditor);
    Vue.use(BootstrapVue);

    Vue.component("dropdown-select", DropDownSelect)

    export default {
        data() {
            return {
                conf: {},
                isLoading: true,
                isAnalysis: true,
                showEditor: true,
                outline: "secondary",
                chosenOutput: 0,
                chosenOutputOld: 0,
                msgBoxTitle: "",
                msgBoxContent: "",
                msgBoxUseHTML: false,
                taskOutputs: [{value: 0, text: "Demo Files", secondaryText: ""}],
            }
        },
        methods: {
            downloadSVG() {
                const svgContainerClone = document.getElementById("canvas").cloneNode(true) as HTMLElement;
                const svgBlob = new Blob([svgContainerClone.innerHTML], { type: "image/svg+xml;charset=utf-8" });
                const svgUrl = URL.createObjectURL(svgBlob);
                const downloadLink = document.createElement("a");
                downloadLink.href = svgUrl;
                downloadLink.download = `${window.gon.analysis_name || 'demo'}.svg`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            },
            useDemoFiles() {
                axios.get(window.gon.urls.use_demo)
                    .then(response => {
                        const result = response.data;
                        if (result.code)
                            location.reload();
                    })
            },
            toggleEditor() {
                this.showEditor=!this.showEditor;
            },
            downloadDemoFiles() {
                // window.open(`${window.gon.urls.download_demo_file}`);
                window.open(window.gon.urls.download_demo_file);
            }
        },        
        created() {
            event.rpcRegisterReceiver("getVue", () => this);
            this.isAnalysis = window.gon.viz_mode === viz_mode.ANALYSIS ? true : false
            
            if (this.isAnalysis) {
                this.chosenOutput = window.gon.chosen_output || 0
                this.chosenOutputOld = window.gon.chosen_output || 0
                axios.get(window.gon.urls.all_task_outputs)
                    .then(response => {
                        const outputs = response.data;
                        outputs.forEach(d=> {
                            this.taskOutputs.push({
                                value: d.id,
                                text: `task-${d.task_id}`,
                            })
                        });
                    });
            }
            event.on(
                event.DATA_LOADING_FINISHED,
                () => {
                    this.isLoading = false;
                    this.$root.$emit("data-loaded");
                },
                "vapp-load-finished",
            );
            event.on(
                "show-msgbox",
                (_, { title, content, html }) => {
                    this.msgBoxTitle = title;
                    this.msgBoxContent = content;
                    this.msgBoxUseHTML = html;
                    (this.$refs.msgBox as any).show();
                },
                "vapp-show-msg-box",
            );
        },
        mounted() {
            event.emit(event.CANVAS_READY, this);
        },
        updated() {
            if (this.isAnalysis) {
                axios.get(`${window.gon.urls.use_task_output}?task_output_id=${this.chosenOutput}`)
                    .then(response => {
                        if(response.data.code) location.reload();
                    })
            }
            
        }
    }

</script>

<style scoped lang="scss">
    #vapp {
        width: 100%;
        min-height: 25rem;
        // height: auto;
        position: relative;
        background-color: white;
    }
    #tool-bar div >* {
        height: 100%;
        color: darkgrey;
        border-top: none;
        border-left: 1px solid darkgrey;
        border-bottom: none;
        border-right: 1px solid darkgrey;
        margin-bottom: 2px;
        text-align:center;
        background-color: white;
        border-radius: 0;
    } 
    .tool-bar-el {
        float: left;
        padding-top:0;
        height: 100%;
        text-align:center;
        border: none;
    }
    .tool-bar-el /deep/ .btn-secondary {
        border-radius: 0;
        padding-top: 0;
        margin-top: 0;
    }
    #tool-bar div{
        height:2.5em;
        background-color: white;
        position: relative;
        border: 1px solid  #ced4da;
    }
    #editor-conf {
        float: right;
    }
    #canvas {
        min-height: calc(500px - 2.5em);
        width: 100vw;
        overflow: scroll;
    }
    .col-md-12 {
        width: 80px;
    }
    #viz-container {
        // position: relative;
        // height:  calc(100% - 2.5em);
        // height: 100%;
        min-height: calc(500px - 2.5em);
        position: relative;
    }
    #v-editor {
        position: absolute;
        top: 0;
        z-index:20;
        transition: all 0.3s;
        right: 10px;
    }
    .need-upload {
        margin: 0 1px;
        padding: 8rem 4rem;
        text-align: center;
        color: #999;
        position: absolute;
    }
</style>