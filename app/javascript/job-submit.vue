<template>
    <!-- eslint-disable max-len -->
    <div class="row my-4">
        <div class="col-md-12">
            <div id="run-app">
                <alert-center ref="alertCenter" />
                
                <!-- Inputs -->
                <div v-if="!submitted">
                    <h3 class="text-center">{{ app.name }}
                        <i class="fa  fa-question-circle" b-tooltip.hover
                                       :title="app.description"></i>
                    </h3>
                    <div class="set-input-section" ref="inputSection">
                        <h4>Set Input Data</h4>
                        <template v-if="displayedInputs.length > 0">
                            <div class="row">
                                <div class="col-md-6" v-for="input in displayedInputs" :key="input.id">
                                    <label :for="`i-${input.id}`">{{ input.name }}
                                        <span v-if="input.required" class="required">*</span>
                                        <i class="fa  fa-question-circle" b-tooltip.hover
                                        :title="input.description"></i>
                                    </label>

                                    <select class="form-control custom-select" 
                                        v-if="input.name=='second_i'"
                                        :id="`i-${input.id}`"
                                        :name="`i-${input.id}`"
                                        :required="input.required"
                                        v-model="selected[`i-${input.id}`]"
                                        :state="inputValid[`i-${input.id}`]"
                                    >
                                        <option value="">--Please choose a file--</option>
                                        <option v-for="(option, index) in select_box_option" :key="index" :value="option.value" :disabled="option.disabled">
                                            {{option.lable}}
                                        </option>
                                    </select>

                                    <b-form-file
                                        v-else
                                        :id="`i-${input.id}`"
                                        v-model="files[`i-${input.id}`]"
                                        :state="inputValid[`i-${input.id}`]"
                                        placeholder="Choose a file or drop it here..."
                                        drop-placeholder="Drop file here..."
                                        :name="`i-${input.id}`"
                                        :required="input.required"
                                    ></b-form-file>



                                </div>
                            </div>
                        </template>
                    </div>
                
                    <!-- Params -->
                    <div class="set-param-section mt-4">
                        <h4>Set Parameters</h4>
                        <template v-if="displayedParams.length > 0">
                            <div class="row">
                                <div class="col-md-6" v-for="param in displayedParams" :key="param.id">
                                    <label :for="`p-${param.id}`">{{ param.name }}
                                        <span v-if="param.required" class="required">*</span>
                                        <i class="fa  fa-question-circle" b-tooltip.hover
                                        :title="param.description"></i>
                                    </label>
                                    <div v-if="param.param_type === 'string'">
                                        <b-form-input :id="`p-${param.id}`" :value="param.default" :required="param.required"
                                                    :name="`p-${param.id}`" :state="inputValid[`p-${param.id}`]" />
                                    </div>
                                    <div v-else-if="param.param_type === 'int'">
                                        <b-form-input :id="`p-${param.id}`" :value="param.default" type="number" step="1"
                                                    :required="param.required" :name="`p-${param.id}`"
                                                    :state="inputValid[`p-${param.id}`]"/>
                                    </div>
                                    <div v-else-if="param.param_type === 'float'">
                                        <b-form-input :id="`p-${param.id}`" :value="param.default" type="number"
                                                    step="0.01" :required="param.required"
                                                    :name="`p-${param.id}`" :state="inputValid[`p-${param.id}`]"/>
                                    </div>
                                    <div v-else-if="param.param_type === 'boolean'">
                                        <b-form-select :id="`p-${param.id}`" :options="boolSelectOpt" :required="param.required"
                                                    :name="`p-${param.id}`" :state="inputValid[`p-${param.id}`]"/>
                                    </div>
                                    <div v-else-if="param.param_type === 'enum'">
                                        <select :id="`p-${param.id}`" class="form-control custom-select" 
                                                :required="param.required" :name="`p-${param.id}`" 
                                                :state="inputValid[`p-${param.id}`]">
                                            <option v-for="option in param.options" :value="option" :key="option"
                                                    :selected="param.default == option ? 'selected' : ''">
                                                {{ option }}
                                            </option>
                                        </select>
                                    </div>
                                    <div v-else-if="param.param_type === 'splitchr'">
                                        <b-form-select :id="`p-${param.id}`" :options="boolSelectOpt" 
                                                    :required="param.required" :name="`p-${param.id}`" 
                                                    :state="inputValid[`p-${param.id}`]" />
                                    </div>
                                </div>
                            </div>
                        </template>
                        <p v-if="displayedParams.length == 0">No Parameters.</p>
                    </div>
                    
                    <b-btn @click="submitTask" class="float-right mt-2"><i class="fa fa-location-arrow"></i> Submit</b-btn>
                    <div class="is-loading w-100" v-if="isLoading">
                        <i class="fas fa-spinner fa-pulse fa-5x m-0"></i>
                        <h3 class="mt-4">Submitting task……</h3>
                    </div>
                </div>
                <div v-else>
                    <b-card class="text-center job-info">
                        <p>Job submitted successfully. The job ID is <span class="text-danger">{{jobID}}</span>. You can check your job status via this job ID in job query page. Please write down the job ID in your note book.</p>
                    </b-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import Vue from 'vue';
    import axios from 'axios';
    import objectToFormData from 'object-to-formdata';
    import BootstrapVue from 'bootstrap-vue';
    import VueTagsInput from '@johmun/vue-tags-input';
    import AlertCenter from 'components/alert-center.vue';
    import GlobalSaveButton from 'components/global-save-button.vue';
    import * as $ from "jquery";

    Vue.use(BootstrapVue);

    export default {
        data() {
            return {
                id: window.gon.id,
                app: {
                    name: '',
                    inputs: [],
                    params: [],
                },
                files: {

                },
                selected: {},
                boolSelectOpt: [
                    { value: true, text: 'Yes' },
                    { value: false, text: 'No' },
                ],
                inputValid: {},
                submitted: false,
                jobID: '',
                isLoading: false,
            };
        },
        created() {
            this.selected = {};
            this.select_box_option = [];
            var ds = window.gon.select_box_option;
            var oplist = [];
            for (var key in ds){
                var op = {value: key, lable: key};
                oplist.push(op);
            }
            this.select_box_option = oplist

            axios.get(`https://deepomics.org/api/apps/${this.id}/`).then((response) => {
                this.app = response.data.app;
                for (var k in this.app.inputs){
                    // alert(k);
                    this.files['i-' + this.app.inputs[k].id]  = null;
                }
            });
        },
        computed: {
            displayedInputs() {
                // eslint-disable-next-line
                return _.sortBy(this.app.inputs.filter(x => !x._destroy), ['name']);
            },
            displayedParams() {
                // eslint-disable-next-line
                return _.sortBy(this.app.params.filter(x => !x._destroy), ['name']);
            }
        },
        watch: {
        },
        methods: {
            setStatusColor(status) {
                switch (status) {
                    case 'wait':
                        return 'secondary';
                    case 'running':
                        return 'info';
                    case 'finished':
                        return 'success';
                    case 'failed':
                        return 'danger';
                    case 'suspended':
                        return 'warning';
                    case 'aborted':
                        return 'danger';
                }
            },
            formatParams() {
                return Array.from(document.querySelectorAll("input[name^='p-'], select[name^='p-']"))
                            .filter(x => x.value)
                            .map(({ name, value }) => ({ [name]: value}));
            },
            submitTask() {
                // send selected file to files
                const { alertCenter } = this.$refs;
                let allRight = true;
                document.querySelectorAll('input').forEach((input) => {
                    if(input.required) {
                        const valid = !!input.value && !!_.trim(input.value);
                        Vue.set(this.inputValid, input.name, valid);
                        if (!valid) {
                            allRight = false;
                        }
                    }
                })
                if (allRight) {
                    let alertData;
                    $("#disable-fill").fadeIn(10);
                    this.isLoading = true;
                    axios.post(
                        `/submit-app-task/`,
                       objectToFormData({
                            "app_id": this.app.id,
                            "inputs": this.files,
                            "params": this.formatParams(),
                            "selected": this.selected,
                            "mid": this.id,
                        }),
                        {
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                                'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                                'Content-Type': 'multipart/form-data',
                            },
                        },
                    ).then((response) => {
                        if (response.data.code) {
                            this.jobID = response.data.data.task_id;
                            this.submitted = true;
                        } else {
                            alertData = response.data.msg;
                        }
                    }).catch((reason) => {
                        alertData = reason;
                    }).finally(() => {
                        setTimeout(() => {
                            $("#disable-fill").fadeOut(10);
                            this.isLoading = false;
                            if (!!alertData) {
                                alertCenter.add('danger', alertData);
                            }
                        }, 500);
                    });
                }
            },
            setSelectBox(){
                var i = 0;
                var s = "<option disabled vaule=''>Choose a file</option>";
                var list = ["dataset1-data.csv", "dataset2-data.csv", "dataset3-data.csv"]

                for(i=0; i<list.length; i++){
                    s += "<option>" + list[i] + "</option>";
                }

                this.$refs.select_box = s

            },
        },
        components: {
            VueTagsInput, AlertCenter, GlobalSaveButton,
        },
    };
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';
#run-app #alert-center {
	z-index: 1000;
}

#run-app .required {
	color: red;
}

#run-app .set-input-section label {
	margin-top: 10px;
}

#run-app .set-input-section input {
	padding-right: 46px;
	cursor: pointer;
}

#run-app .set-input-section .icon-append {
	top: 38px;
	color: #6f6f6f;
	cursor: pointer;
	right: 10px;
	padding-left: 3px;
	border-left: solid 1px #d7d7d7;
	position: absolute;
	width: 34px;
	height: 34px;
	font-size: 15px;
	line-height: 34px;
	text-align: center;
}

#run-app .set-param-section label {
	margin-top: 10px;
}
#run-app .job-info{
    min-height: 200px;
    padding: 100px 20px;
    font-size: 30px;
}
.is-loading {
    margin: 0 1px;
    padding: 8rem 4rem;
    text-align: center;
    color: #000;
    position: absolute;
    top:0;
    z-index: 1000;
    width: 100%;
    height: 100%;
}
</style>
