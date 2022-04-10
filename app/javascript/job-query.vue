<template>
<!-- eslint-disable max-len -->
<div id="job-query">
    <alert-center ref="alertCenter" />
    <div>
        <div v-if="!submitted">
            <b-card class="text-center query-card">
                <div class="img-icon">
                    <i class="fas fa-tasks"></i>
                </div>
                <p>Find your submitted job by Job ID</p>
                <div class="row justify-content-center">
                    <b-input-group class="justify-content-center">
                    <b-form-input
                        v-model="job_id"
                        size="lg"
                        :state="valid_name"
                        placeholder="Enter your job ID"
                        class="col-md-4 text-center"
                    ></b-form-input>
                    <b-input-group-append>
                        <b-button variant="secondary" size="lg" @click="searchJob"
                        ><i class="fas fa-search"></i> Search</b-button
                        >
                    </b-input-group-append>
                    </b-input-group>
                </div>

                <div class="local-jobs .container">
                <div class = "center-title">
                    <div class = "row">
                        <h3 class="font-weight-bold .col">Local Jobs <span v-b-tooltip.hover title="Only the lastest ten jobs are stored. Exceeding jobs are deleted automatically"><i class="fas fa-exclamation-circle small"></i></span></h3>
                        <b-button variant="success" class="btn-sm .col" @click="refreshJobs()">Refresh</b-button>
                        <div class ="ml-3" v-if="!refreshEnd"><i class="fas fa-spinner fa-spin" style='font-size:28px'> </i> </div>
                    </div>
                </div>
                    <b-table
                        class="jobs-table"
                        hover
                        :items="all_jobs"
                        :fields="fields"
                        v-if="showTable"
                    >
                    <template #cell(index)="data">
                        {{ data.index + 1 }}
                    </template>
                    
                    <template #cell(status)="data">
                        <b-badge
                            pill
                            variant="success"
                            v-if="data.item.status == 'finished'"
                            >Finished</b-badge
                        >
                        <span v-else-if="data.item.status == 'failed'" v-b-tooltip.hover title="Please check the format of your file!">
                            <b-badge
                                pill
                                variant="danger"
                                >Failed
                                <i class="fas fa-exclamation-circle small"></i>
                            </b-badge>
                            </span>
                        <b-badge pill variant="info" v-else>Running</b-badge>
                    </template>
                    <template #cell(operation)="data">
                        <b-button
                            variant="primary"
                            size="sm"
                            v-if="data.item.status == 'finished'"
                            @click="showAnalyses(data.item.jobId)"
                            >
                        <i class="fas fa-search mr-1"></i>Result</b-button
                        >
                        <b-button variant="primary" size="sm" v-else disabled>
                        
                        <i class="fas fa-search mr-1"></i>Result</b-button>
                        <b-button
                            variant="danger"
                            size="sm"
                            class="ml-4"
                            @click="deleteJob(data.item.jobId)"
                        >
                        <i class="fas fa-trash-alt mr-1"></i>Delete
                        </b-button>
                    </template>
                    
                    </b-table>
                </div>
            </b-card>
        </div>
        <div v-else class="viz-result mb-1">
            <b-card no-body>
                <b-card-header v-b-modal.modalBox class="border-1">
                    <b-button class="btn col-md-2" variant = "primary" @click="returnQuery">
                    <i class="fas fa-arrow-left"></i> Back to query
                    </b-button>
                    <b-button variant="dark" class="btn col-md-4" disabled >{{`${jobName}(${job_id})`}}
                    </b-button>
                    <dropdown-select v-if="data.outputs.length > 1"
                            right
                            v-model="chosenOutput"
                            :options="taskOutputs"
                            class="tool-bar-el"/>
                    <b-button v-else variant="dark" class="btn col-md-4" disabled >{{data.outputs[0].name}}
                    </b-button>
                </b-card-header>
                <b-card-body class="p-0">
                   <div id = "viz-card"> 
                        <VApp/>
                    </div>
                </b-card-body>
            </b-card>
        </div>
    </div>
</div>
</template>

<script>
import _ from 'lodash';
import Vue from 'vue';
import axios from 'axios';
import objectToFormData from 'object-to-formdata';
import AlertCenter from 'components/alert-center.vue';
import VApp from "page/vapp.vue";
import DropDownSelect from "page/builtin/dropdown-select.vue";
import { event } from "crux/dist/utils";
import {registerViz} from "viz";

Vue.component("VApp", VApp);
// Vue.use(BootstrapVue);
Vue.component("dropdown-select", DropDownSelect);

export default {
    data() {
        return {
            job_id: '',
            jobName: '',
            all_jobs: [],
            fields: ["index", "jobName", "jobId", "created", "status", "operation"],
            showTable:  true,
            valid_name: null,
            submitted: false,
            code: false,
            data: {outputs: []},
            chosenOutput: null,
            taskOutputs: [{value: 0, text: "Demo Files", secondaryText: ""}],
            refreshEnd: true,
        };
    },
    created() {
           this.refreshJobs();
        },
    mounted(){
        window.gon.viz_mode = "task-output";
    },
    updated(){
        if(this.submitted) {
            event.emit("GMT:reset-query", this);
            this.updateGon(this.data.outputs[this.chosenOutput]);
            event.emit("GMT:query-finished", this);
        }
    },
    methods: {
        searchJob() {
            const { alertCenter } = this.$refs;
            
            if (this.job_id.length <= 0){
                this.valid_name = false;
            }else {
                this.all_jobs.forEach(j => {
                    if (j.jobId === parseInt(this.job_id))
                        this.jobName = j.jobName;
                })
                axios.post(
                    `/query-app-task/`,
                    objectToFormData({'job_id': this.job_id}),
                    {  
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                ).then((response) => {
                    if (response.data.code === false) {
                        this.submitted = false;
                        alertCenter.add('danger', `${response.data.data}`);
                    } else {
                        this.data.outputs = response.data;
                        this.updateGon(this.data.outputs[0]);
                        this.taskOutputs = this.data.outputs.map((x, i) => ({value: i, text: x.name}));
                        this.chosenOutput = 0;
                        this.submitted = true;
                    }
                }).catch((error) => {
                    const message = error.response && error.response.status === 404 ? "The task does not exist" : error;
                    alertCenter.add('danger', `${message}`);
                }).finally(() => {
                    // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
                });
            }
        },
        showAnalyses(jobId) {
            this.job_id = jobId;
            this.searchJob();
        },
        updateGon(output) {
            window.gon.module_name = output.module_name;
            window.gon.required_data = output.required_data;
            if (!window.gon.urls) window.gon.urls = {};
            window.gon.urls.chosen_file_paths = `/api/analysis/${output.analysis_id}/chosen_file_paths`;
            window.gon.urls.download_demo_file = `/api/analysis/${output.analysis_id}/download_demo_file`;
            registerViz(output.module_name);
        },
        refreshJobs() {
            this.refreshEnd = false;
            axios.post(
                `/query-all-tasks/`,
                null,
            {  
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(r => {
                this.all_jobs = r.data.map((d, index) => {
                    return  {index, ...d}
                });
            }).finally(() => {
                // wait 1 sec
                 setTimeout(() => {
                    this.refreshEnd = true;
                    }, 1000);
            });
        },
        deleteJob(jobId){
            const { alertCenter } = this.$refs;
            axios.post(
                `/remove-task/`,
                objectToFormData({'job_id': jobId}),
                {  
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then(r => {
                    this.refreshJobs();
                })
                .catch(error => {
                    alertCenter.add('danger', error);
                });
        },
        returnQuery(){
            event.emit("GMT:reset-query", this);
            this.submitted = false;
        },
        token_search(token){
            this.job_id = token;
            this.searchJob();
        },
    },
    components: {
        AlertCenter,
    },
};
</script>

<style lang="scss">
#job-query {
    min-height: 900px;
    max-height: 1200px;
    margin-top: 10px;
}
#job-query .fas.fa-tasks {
	font-size: 5rem !important;
	margin-right: 0px;
}

#job-query .query-card {
    margin: 20px;
	padding: 3rem;
}
// all jobs
.local-jobs {
    margin-top: 2em;
}
.center-title {
    margin: auto; 
    max-width: 250px;
}

#job-query .result-card {
    margin: 0;
    font-size: 20px;
}
//result card div
#job-query .error-info {
    min-height: 300px;
}
#job-query .result-image {
    width: 70%;
}
// .task{
//     margin: 1em
// }
#tool-bar {
    height:30px;
    background:lightgrey; 
    position: relative;
}
#editor-conf {
    position: absolute;
    right: 0;
}
.viz-result {
    #canvas {
        height: 800px;
        width: 100%;
        overflow: scroll;
    }
}

.col-md-12 {
    width: 80px;
}
#viz-container {
    position: relative;
}
#viz-card {
    border: 1px solid #999;
    height: 835px;
}
.v-editor {
    position: absolute;
    top: 0;
    right: 0;
    z-index:20;
    transition: all 0.3s
}
</style>
