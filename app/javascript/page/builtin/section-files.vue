<template>
    <div>
        <!-- File modal -->

        
        <b-modal size="lg" id="fmModal" ref="fmModal" title="Manage Files">
            <b-container fluid>
                <template v-for="key in fileKeys">
                    <b-card no-body :key="key.fileIndex" class="mt-2 mb-2">
                        <b-card-header header-tag="header" role="tab">
                            <b-link
                                v-b-toggle="`collapse-manageFile-${key.fileIndex}`"
                            >{{ key.fileName }}</b-link>
                        </b-card-header>
                        <b-collapse visible :id="`collapse-manageFile-${key.fileIndex}`">
                            <b-card-body v-if="key.files.length === 0">
                                <p class="card-text">No available files.</p>
                            </b-card-body>
                            <b-list-group flush v-else>
                                <b-list-group-item
                                    v-for="file in key.files"
                                    :key="file.id"
                                    :variant="willBeDeleted(file) ? 'danger' : ''"
                                >
                                
                                    <div>
                                        <div>
                                            <i class="fa fa-file-excel" v-if="willBeDeleted(file)"></i>
                                            <i class="fa fa-file" v-else></i>
                                            {{ file.name }}
                                            <span
                                                class="badge badge-success"
                                            >Processed</span>
                                            <!--
                                            <span
                                                class="ml-1 small text-muted"
                                            >{{ filesize(file.size) }}</span>
                                            -->
                                        </div>
                                        
                                        <div
                                            class="d-flex justify-content-between align-items-end action-container"
                                                >
                                            <div style="padding-left:1.25rem">
                                                <div>
                                                    <span
                                                        class="text-muted small"
                                                    >Uploaded at {{ parseDate(file.created_at) }}</span>
                                                </div>
                                                <!--
                                                <div v-if="file.assoc.length">
                                                    <span class="small">Processed files:</span>
                                                    <a
                                                        v-for="k in file.assoc"
                                                        :key="k"
                                                        :href="downloadURL(file, k)"
                                                        class="assoc-link"
                                                        target="_blank"
                                                    >
                                                        <i class="fas fa-link"></i>
                                                        {{ k }}
                                                    </a>
                                                </div>
                                                -->
                                            </div>
                                            <div class="d-flex">
                                                <b-link
                                                    :href="downloadURL(file)"
                                                    target="_blank"
                                                    class="action-btn left"
                                                >
                                                    <i class="fa fa-download"></i>Download
                                                </b-link>
                                                <template>
                                                    <b-link
                                                        class="action-btn right"
                                                        @click="markAsDeleted(file)"
                                                    >
                                                        <i class="fa fa-trash"></i>
                                                        {{ willBeDeleted(file) ? "Cancel Mark" : "Mark as Deleted" }}
                                                    </b-link>
                                                </template>
                                            </div>
                                        </div>
                                        
                                    </div>
                                
                              <!--      <div class="mt-1" v-if="Object.keys(file.metadata).length">
                                        Metadata:
                                        <code>{{ JSON.stringify(file.metadata) }}</code>
                                    </div> -->
                                </b-list-group-item>
                            </b-list-group>
                        </b-collapse>
                    </b-card>
                </template>
            </b-container>
            <div slot="modal-footer" class="w-100">
                <b-btn
                    :disabled="fmHasNoPendingChanges"
                    class="float-right"
                    variant="primary"
                    @click="fmApplyChanges"
                >
                    <i class="fa fa-circle-notch fa-spin" v-if="fmApplyingChanges"></i>
                    <i class="fa fa-check" v-else></i>
                    Apply Changes
                </b-btn>
            </div>
        </b-modal>
        
        <!-- File set modal -->
        <!--
        <b-modal hide-footer size="lg" id="fsModal" ref="fsModal" title="Manage File Sets">
            <b-container fluid>
                <div v-if="!fileSets.length">No file set.</div>
                <template v-for="set in fileSets">
                    <b-card no-body :key="set.id" class="mt-2 mb-2">
                        <b-card-header
                            header-tag="header"
                            role="tab"
                            class="d-flex justify-content-between"
                        >
                            <div>
                                <b-link v-b-toggle="`collapse-manageFile-${set.id}`">
                                    <i class="fa fa-copy"></i>
                                    {{ set.name }}
                                </b-link>
                            </div>
                            <div>
                                <b-link class="mr-2" @click="applyChosenFiles(true, set)">
                                    <i class="fa fa-check"></i>Apply
                                </b-link>
                                <b-link variant="danger" @click="deleteFileSet(set.id)">
                                    <i class="fa fa-trash"></i>Delete
                                </b-link>
                            </div>
                        </b-card-header>
                        <b-collapse visible :id="`collapse-manageFile-${set.id}`">
                            <b-list-group flush>
                                <b-list-group-item
                                    v-for="file in set.files"
                                    :key="file.id"
                                    class="d-flex justify-content-between"
                                >
                                    <div>
                                        <i class="fa fa-file"></i>
                                        <b-badge
                                            variant="primary"
                                        >{{ _fileById[file.id].description }}</b-badge>
                                        {{ _fileById[file.id].filename }}
                                        <span
                                            class="ml-1 text-muted"
                                        >{{ filesize(_fileById[file.id].size) }}</span>
                                    </div>
                                    <div>
                                        <span
                                            class="mr-1 text-muted"
                                        >Uploaded at {{ parseDate(_fileById[file.id].created_at) }}</span>
                                    </div>
                                </b-list-group-item>
                            </b-list-group>
                        </b-collapse>
                    </b-card>
                </template>
            </b-container>
        </b-modal>
        -->


        <b-popover
            id="renamePopover"
            target="uploadBtn"
            placement="left"
            boundary="viewport"
            disabled
            :show.sync="showNewFileNamePopup"
            title="Duplicated file name"
        >
            <div
                class="mb-2"
            >It's not recomended to re-upload a file with duplicated name. We have generated a new filename for you, or you can enter another filename.</div>
            <div v-for="(name, key) in newFileNames" :key="key">
                {{ filesForUpload[key].name }}:
                <b-form-input size="sm" v-model="newFileNames[key]" class="mb-2" />
            </div>
            <b-btn block size="sm" variant="primary" @click="uploadFiles">Continue</b-btn>
        </b-popover>
        <b-card-body>
            <b-btn block size="sm" v-b-modal.fmModal>
                <i class="fa fa-sliders-h"></i>Manage Files
            </b-btn>
        </b-card-body>
        <b-tabs card no-fade>
            <b-tab title="Upload" active>
                <template v-for="key in fileKeys">
                    <div :key="key.dataType + '-desc'" class="mb-1">
                        {{ key.fileName }}:
                        <span
                            v-if="key.optional"
                            class="text-muted"
                        >(Optional)</span>
                    </div>
                    <b-form-file
                        :key="key.dataType + '-finput'"
                        ref="formFiles"
                        class="mb-2"
                        v-model="filesForUpload[key.dataType]"
                        :state="Boolean(filesForUpload[key.dataType])"
                        placeholder="Choose a file..."
                    />
                    <component
                        :key="key.dataType"
                        :ref="`uploadComponent_${key.dataType}`"
                        v-if="config[key.dataType] && config[key.dataType].uploadComponent"
                        :is="config[key.dataType].uploadComponent"
                    />
                </template>
                <b-btn
                    id="uploadBtn"
                    block
                    size="sm"
                    variant="primary"
                    :disabled="cannotUpload"
                    @click="tryUploadFiles"
                >
                    <i class="fa fa-circle-notch fa-spin" v-if="uploadingFiles"></i>
                    <i class="fa fa-upload" v-else></i>
                    Upload
                </b-btn>
            </b-tab>
            <b-tab title="Choose">
                <template v-for="key in fileKeys">
                    <div :key="key.dataType + '-desc'" class="mb-1">
                        {{ key.fileName }}:
                        <span
                            v-if="key.optional"
                            class="text-muted"
                        >(Optional)</span>
                    </div>
                    <dropdown-select
                        :key="key.dataType + '-fselect'"
                        right
                        v-model="filesChosen[key.dataType]"
                        :options="fileSelectOptions(key.dataType)"
                        size="sm"
                        class="mb-2 sel-file btn-block"
                    />
                </template>
                <div class="row m-0 no-gutters">
                    <div class="col-4">
                        <b-btn size="sm" @click="resetChosenFiles">
                            <i class="fa fa-redo"></i>Reset
                        </b-btn>
                    </div>
                    <div class="col-8">
                        <b-btn
                            block
                            size="sm"
                            variant="primary"
                            :disabled="cannotApplyChosenFiles"
                            @click="applyChosenFiles(false)"
                        >
                            <i class="fa fa-circle-notch fa-spin" v-if="applyingChosenFiles"></i>
                            <i class="fa fa-check" v-else></i>
                            Apply
                        </b-btn>
                    </div>
                </div>
            </b-tab>

    <!--            
            <b-tab title="File Sets">
                <b-btn
                    block
                    size="sm"
                    id="saveCurrentFileAsSet"
                    :disabled="cannotCreateFileSet"
                    class="mb-1"
                >Save current files as file set</b-btn>
                <b-popover
                    target="saveCurrentFileAsSet"
                    :container="null"
                    boundary="window"
                    placement="left"
                    title="New File Set"
                    triggers="click"
                    :show.sync="showSaveFileSetPopup"
                >
                    <div class="mb-1">Please enter a name for the new file set:</div>
                    <b-form-input size="sm" v-model="newFileSetName" class="mb-2" />
                    <b-btn block size="sm" variant="primary" @click="createFileSet">
                        <i class="fa fa-circle-notch fa-spin" v-if="creatingNewFileSet"></i>
                        <i class="fa fa-check" v-else></i>
                        Save
                    </b-btn>
                </b-popover>
                <small
                    class="text-muted form-text mb-2"
                    v-if="cannotCreateFileSet"
                >You haven't chosen some required files, or there is already such a file set.</small>
                <small class="text-muted form-text mb-2" v-else>
                    This will save current applied files as a new fileset:
                    <div v-for="fid in validChosenFiles" :key="fid">- {{ _fileById[fid].filename }}</div>
                </small>
                <b-btn block size="sm" class="mb-1" v-b-modal.fsModal>Apply or Manage file sets</b-btn>
                <small class="text-muted form-text">Apply an existing file set, or manage them.</small>
            </b-tab>
    -->
        </b-tabs>
        <div class="px-2 py-1 text-muted small">
            We will not access your files without permission from you. Your file will be deleted entirely if you have been inactive for 24 hours.
            <a
                href="/privacy-policy"
                target="_blank"
            >Privacy Policy</a>
        </div>
    </div>
</template>

<script lang="ts">
import * as randomstring from "randomstring";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import DropdownSelect from "./dropdown-select.vue";

import axios from "axios";
import * as _ from "lodash";

import * as filesize from "filesize";

function axiosConfig(multipart: boolean = false) {
    const config = {
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-Token": document.head.querySelector<HTMLMetaElement>('meta[name="csrf-token"]').content,
        },
    };
    if (multipart) {
        config.headers["Content-Type"] = "'multipart/form-data'";
    }
    return config;
}

interface FileInfo {
    filename: string;
    file_key?: string;
    description?: string;
    belongs_to_sets?: string[];
    id: number;
    url: string;
    size: number;
    created_at: string;
    status: string;
    jobid: number;
    genome_ref?: string;
    metadata: { [key: string]: string };
}

// interface FileKey {
//     name: string;
//     description: string;
//     optional: boolean;
//     multiple: boolean;
//     files: FileInfo[];
// }

interface FileKey {
    fileIndex: Integer;
    fileName: string;
    dataType: string;
    optional: boolean;
    multiple: boolean;
    files: FileInfo[];
}

interface FileSet {
    id: number;
    name: string;
    files: Array<{ id: number }>;
}

@Component({
    name: "section-files",
    components: { DropdownSelect },
})

export default class SectionFiles extends Vue {
    @Prop({ default: {}}) public data: {};

    private config = {};
    public ooo = {};
    public fileKeys: FileKey[] = [];
    public filesForUpload: Record<string, File> = {};
    public newFileNames: Record<string, string> = {};
    public showNewFileNamePopup = false;
    public uploadingFiles = false;
    public filesToBeDeleted: number[] = [];
    public filesChosen: Record<string, number> = {};
    public applyingChosenFiles = false;
    public newFileSetName = "New file set";
    public fileSets: FileSet[] = [];
    public creatingNewFileSet = false;
    public applyingFileSet = false;
    public showSaveFileSetPopup = false;
    public fmHasNoPendingChanges = true;
    public fmApplyingChanges = false;

    public uploadComponent = {};

    private _fileById: { [key: number]: FileInfo };
    private _fileKeyByName: { [key: string]: FileKey };
    private _appliedFiles: { [key: string]: number };

    public created() {
        this.refreshFileList();
        this._fileById = {};
        this._appliedFiles = {};
        this._fileKeyByName = {};
        if (!!this.data.config) this.config = this.data.config;
    }

    get requiredFilesChosen() {
        return _.omitBy(this.filesChosen, (v, k) => {           
            this._fileKeyByName[k].optional
        });
    }

    get cannotUpload() {
        // enable when at least one file exists.
        return this.uploadingFiles || !Object.keys(this.filesForUpload).reduce((a, c) => a || !!this.filesForUpload[c], false);
    }

    get cannotApplyChosenFiles() {
        const files = this.requiredFilesChosen;

        // all file input should has value
        // and is different from currently applied files
        return _.includes(_.values(files), null) || _.reduce(this.filesChosen, (r, v, k) => r && v === this._appliedFiles[k], true);
    }

    get cannotCreateFileSet() {
        const files = this.requiredFilesChosen;
        if (_.includes(_.values(files), null)) {
            return true;
        }
        // cannot create file set if there's already a same one.
        const isSameArray = (superset, subset) => _.difference(subset, superset).length === 0;
        return !!_.find(this.fileSets, fs =>
            isSameArray(
                fs.files.map(f => f.id),
                _.values(files),
            ),
        );
    }

    get validChosenFiles() {
        return Object.values(this.filesChosen).filter(fid => fid >= 0 && this._fileById[fid]);
    }

    public downloadURL(file: FileInfo, output?: string) {
        return `${window.gon.urls.create_file}/${file.id}?dl=1${output ? `&output=${output}` : ""}`;
    }

    public filesize(): string {
        return filesize.apply(this, arguments);
    }

    public parseDate(dateString): string {
        const pad = n => `0${n}`.slice(-2);
        const date = new Date(dateString);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    public fileSelectOptions(key) {
        const allFiles = this.fileKeys.find(k => k.dataType === key);
        if (!allFiles) {
            return [];
        }
        const result = allFiles.files
            .map(f => ({
                value: f.id,
                text: f.name,
                secondaryText: this.parseDate(f.created_at),
            }));

        if (allFiles.optional) {
            result.push({
                value: "null" as any,
                text: "(None)",
                secondaryText: "",
            });
        }
        return result;
    }

    public willBeDeleted(file) {
        return _.includes(this.filesToBeDeleted, file.id);
    }

    public markAsDeleted(file) {
        if (_.includes(this.filesToBeDeleted, file.id)) {
            this.filesToBeDeleted = _.reject(this.filesToBeDeleted, x => x === file.id);
        } else {
            this.filesToBeDeleted.push(file.id);
        }
        this.fmHasNoPendingChanges = this.filesToBeDeleted.length === 0;
    }

    public tryUploadFiles() {
        
        this.newFileNames = {};
        _.forOwn(this.filesForUpload, (file, key) => {
            // debugger;
            const filename = file.name;
            if (this._fileKeyByName[key].files.some(f => f.filename === filename)) {
                const pos = filename.lastIndexOf(".");
                const baseName = filename.substring(0, pos);
                const ext = filename.substring(pos);
                this.newFileNames[key] = `${baseName}_${randomstring.generate(6)}`;
            }
        });
        if (Object.keys(this.newFileNames).length > 0) {
            this.showNewFileNamePopup = true;
        } else {
            this.uploadFiles();
        }
    }

    public uploadFiles() {
        this.uploadingFiles = true;
        this.showNewFileNamePopup = false;
        const formData: FormData = new FormData();
        _.forOwn(this.filesForUpload, (file, key) => {
            formData.append(`_f_${key}`, file);
            formData.append(`_fn_${key}`, this.newFileNames[key] ? this.newFileNames[key] + file.name.substring(file.name.lastIndexOf(".")) : file.name);
            
            // TODO what is keyConf?
            const keyConf = (this.config as any)[key];
            
            if (keyConf && keyConf.uploadComponent) {
                const metadata = (this.$refs[`uploadComponent_${key}`][0] as any).metadata();
                formData.append(`_m_${key}`, JSON.stringify(metadata));
            }
        });
        axios.post(window.gon.urls.create_file, formData, axiosConfig(true)).then(response => {
            this.uploadingFiles = false;
            this.filesForUpload = {};
            this.newFileNames = {};
            (this.$refs.formFiles as any[]).forEach(ff => (ff.selectedFile = null));
            
            this.refreshFileList();
            _.forOwn(response.data.files, (file, fkey) => {
                this.filesChosen[fkey] = file.id;
            });
            this.applyChosenFiles();
        });
    }

    public applyChosenFiles(isFileSet: boolean = false, fileSet = null) {
        // debugger;
        if (isFileSet) {
            fileSet.files.forEach(f => {
                const file = this._fileById[f.id];
                this.filesChosen[file.file_key] = f.id;
            });
            this.applyingFileSet = true;
        } else {
            this.applyingChosenFiles = true;
        }
        const data = {};
        _.forOwn(this.filesChosen, (fid, fkey) => data[`_f_${fkey}`] = fid);
        
        axios
            .post(window.gon.urls.chosen_files, data, axiosConfig())
            .then(response => { // the post api call is to update chosen data list, n
            // ot directly returned
                if (response.data.status === "ok") {
                    this.refreshFileList();
                } else {
                    window.alert(response.data.error);
                }
            })
            .catch(reason => {
                window.alert(reason);
            })
            .then(() => {
                // if (isFileSet) {
                //     this.applyingFileSet = false;
                //     (this.$refs.fsModal as any).hide();
                // } else {
                //     this.applyingChosenFiles = false;
                // }
                this.applyingChosenFiles = false;
                location.reload();
            });
    }

    public resetChosenFiles() {
        this.filesChosen = _.clone(this._appliedFiles);
    }

    public createFileSet() {
        const data = {
            name: this.newFileSetName,
            file_ids: _.values(this.filesChosen),
        };
        axios
            .post(window.gon.urls.file_sets, data, axiosConfig())
            .then(response => {
                if (response.data.status === "ok") {
                    this.refreshFileList();
                } else {
                    window.alert(response.data.error);
                }
            })
            .catch(reason => {
                window.alert(reason);
            })
            .then(() => {
                this.creatingNewFileSet = false;
                this.showSaveFileSetPopup = false;
            });
    }

    public deleteFileSet(setId) {
        if (!window.confirm("Are you sure?")) {
            return;
        }
        axios
            .delete(window.gon.urls.delete_file_set.replace("_id_", setId), axiosConfig())
            .then(response => {
                this.refreshFileList();
            })
            .catch(reason => {
                window.alert(reason);
            });
    }

    public fmApplyChanges() {
        // debugger;
        this.fmApplyingChanges = true;
        const chosenSet = new Set(Object.values(this.filesChosen));
        const deletedChosenFile = this.filesToBeDeleted.some(f => chosenSet.has(f));
        axios
            .post(window.gon.urls.batch_delete_files, { file_ids: this.filesToBeDeleted }, axiosConfig())
            .then(response => {
                this.fmApplyingChanges = false;
                (this.$refs.fmModal as any).hide();
                this.refreshFileList();
                if (deletedChosenFile) {
                    location.reload();
                }
            })
            .catch(reason => {
                window.alert(reason);
                this.fmApplyingChanges = false;
            });
    }

    public refreshFileList() {
        const fileSetsContaining = (file: FileInfo, sets: FileSet[]): string[] => {
            return sets
                .filter(fs =>
                    _.includes(
                        fs.files.map(x => x.id),
                        file.id,
                    ),
                )
                .map(fs => fs.name);
        };

        axios.all([axios.get(window.gon.urls.all_files), axios.get(window.gon.urls.chosen_files)]).then(
            axios.spread((allFilesData, chosen) => {
                const allFiles = allFilesData.data;
                this.fileKeys = []
                allFiles.forEach(f => {
                    const fk: FileKey = {
                        fileIndex: f.id,
                        fileName: f.name,
                        dataType: f.dataType,
                        optional: f.optional,
                        multiple: f.multiple,
                        files: f.files,
                    };
                    this.fileKeys.push(fk);
                })

                this._fileKeyByName = _.keyBy(this.fileKeys, "dataType");
                
                this._fileById = {};
                allFiles.forEach(fkey => {
                    fkey.files.forEach(f => {
                        this._fileById[f.id] = {
                            ...f,
                            file_key: fkey.dataType,
                            // description: fkey.desc,
                            // belongs_to_sets: fileSetsContaining(f, fileSets),
                        };
                    });
                });
                
                const chosenFiles = chosen.data;
                
                this._appliedFiles = chosenFiles.chosen;
                this.resetChosenFiles();

                let needsUpload: any = false;
                if (!chosenFiles.use_demo) {
                    for (const f of allFiles) {
                        if (f.optional) continue;
                        // debugger;
                        if (f.files.length === 0) {
                            needsUpload = { noData: true };
                            break;
                        } else {
                            const chosenFileId = this.filesChosen[f.data_type];
                            if (chosen === null) {
                                needsUpload = { noSelectedData: true };
                                break;
                            }
                            const file = this._fileById[chosenFileId];
                            // const status = file.status;
                            // if (status === "running") {
                            //     needsUpload = { taskRunning: true };
                            // } else if (status === "error") {
                            //     needsUpload = { taskError: true, jobid: file.jobid };
                            // }
                        }
                    }
                }
                this.$root.$emit("file_loaded", needsUpload);
            }),
        );
    }
}
</script>

<style lang="scss" scoped>
    .fa {
        margin-right: 0.1rem;
    }
        
    .sel-file {
        max-width: 100;
    }
    .action-container {
        padding-top: 0.25rem;
    }
    .action-btn{
        background: #00c6ff;
        color: #fff;
        font-size: 90%;
        padding: 4px 12px;
        display: block;
    }
        
    .action-btn .left{
        border-radius: 12px 0 0 12px;
        margin-right: 1px;
    }
        
    .action-btn .right{
        border-radius: 0 12px 12px 0;
    }
        
    .assoc-link{ 
        font-size: 80%;
        background: rgba(255,255,255,.2);
        padding: 2px 4px;
        border-radius: 4px;
        color: #fff;
        margin-right: 0.5rem;
    }
        
    .assoc-link :hover{
        text-decoration: none;
        background: rgba(255,255,255,.3);
    }
        
</style>
