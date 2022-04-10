# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_09_20_032112) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "analyses", force: :cascade do |t|
    t.string "name", null: false
    t.json "files_info"
    t.integer "mid"
    t.text "description"
    t.bigint "analysis_category_id"
    t.bigint "visualizer_id"
    t.text "cover_image"
    t.string "url", null: false
    t.text "documentation"
    t.text "references"
    t.text "about"
    t.text "rendered_ref"
    t.text "rendered_doc"
    t.text "rendered_about"
    t.integer "position"
    t.boolean "hidden", default: false
    t.index ["analysis_category_id"], name: "index_analyses_on_analysis_category_id"
    t.index ["visualizer_id"], name: "index_analyses_on_visualizer_id"
  end

  create_table "analysis_categories", force: :cascade do |t|
    t.string "name", null: false
    t.integer "position"
  end

  create_table "analysis_pipelines", force: :cascade do |t|
    t.string "name", limit: 50, null: false
    t.integer "pid"
    t.text "description"
    t.boolean "hidden", default: false
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "cover_image"
    t.string "url", null: false
  end

  create_table "analysis_user_data", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "analysis_id"
    t.bigint "task_output_id"
    t.json "chosen", null: false
    t.boolean "use_demo_file", default: true
    t.index ["analysis_id"], name: "index_analysis_user_data_on_analysis_id"
    t.index ["task_output_id"], name: "index_analysis_user_data_on_task_output_id"
    t.index ["user_id"], name: "index_analysis_user_data_on_user_id"
  end

  create_table "datasets", force: :cascade do |t|
    t.string "name"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_datasets_on_user_id"
  end

  create_table "datasets_samples", id: false, force: :cascade do |t|
    t.bigint "dataset_id"
    t.bigint "sample_id"
    t.index ["dataset_id"], name: "index_datasets_samples_on_dataset_id"
    t.index ["sample_id"], name: "index_datasets_samples_on_sample_id"
  end

  create_table "module_requirements", force: :cascade do |t|
    t.bigint "analysis_id"
    t.bigint "analysis_pipeline_id"
    t.index ["analysis_id"], name: "index_module_requirements_on_analysis_id"
    t.index ["analysis_pipeline_id"], name: "index_module_requirements_on_analysis_pipeline_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "name"
    t.string "project_id1"
    t.string "project_id2"
    t.text "curated_description"
    t.integer "num_of_samples"
    t.integer "num_of_runs"
    t.integer "population"
    t.text "related_publications"
    t.text "original_description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "public_file_apis", force: :cascade do |t|
    t.string "url_name", limit: 30
    t.string "path", limit: 1024
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["url_name"], name: "index_public_file_apis_on_url_name"
  end

  create_table "samples", force: :cascade do |t|
    t.string "sample_name"
    t.string "project_name"
    t.string "run_id"
    t.string "second_run_id"
    t.string "meta_project_id"
    t.string "experiment_type"
    t.string "nr_reads_sequenced"
    t.string "instrument_model"
    t.string "disease_phenotype"
    t.string "is_disease_stage_available"
    t.string "disease_stage"
    t.text "more"
    t.text "more_info"
    t.string "country"
    t.string "collection_date"
    t.string "sex"
    t.integer "host_age"
    t.string "diet"
    t.string "longitude"
    t.string "lattitude"
    t.float "BMI"
    t.string "associated_phenotype"
    t.string "QC_status"
    t.text "recent_antibiotics_use"
    t.text "antibiotics_used"
    t.text "antibiotics_dose"
    t.integer "days_without_antibiotics_use"
    t.text "original_description"
    t.text "curated_description"
    t.bigint "project_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "abundance_available"
    t.index ["project_id"], name: "index_samples_on_project_id"
  end

  create_table "tabix_apis", force: :cascade do |t|
    t.string "url_name", limit: 30
    t.string "folder", limit: 1024
    t.string "column_names", limit: 1024
    t.string "column_types", limit: 256
    t.json "alias", default: {"main"=>"main.bgz"}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["url_name"], name: "index_tabix_apis_on_url_name"
  end

  create_table "task_outputs", force: :cascade do |t|
    t.bigint "user_id"
    t.integer "output_id", null: false
    t.json "file_paths", null: false
    t.bigint "analysis_id"
    t.bigint "task_id"
    t.index ["analysis_id"], name: "index_task_outputs_on_analysis_id"
    t.index ["task_id"], name: "index_task_outputs_on_task_id"
    t.index ["user_id"], name: "index_task_outputs_on_user_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.bigint "user_id"
    t.integer "tid", null: false
    t.string "status", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "analysis_id"
    t.bigint "analysis_pipeline_id"
    t.index ["analysis_id"], name: "index_tasks_on_analysis_id"
    t.index ["analysis_pipeline_id"], name: "index_tasks_on_analysis_pipeline_id"
    t.index ["user_id"], name: "index_tasks_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.integer "dataset_n"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "genome_reference", default: "hg19"
  end

  create_table "visualizers", force: :cascade do |t|
    t.string "name", null: false
    t.string "js_module_name", null: false
  end

  create_table "viz_data_sources", force: :cascade do |t|
    t.string "data_type", null: false
    t.boolean "optional", default: false
    t.boolean "allow_multiple", default: false
    t.bigint "visualizer_id"
    t.index ["visualizer_id"], name: "index_viz_data_sources_on_visualizer_id"
  end

  create_table "viz_file_objects", force: :cascade do |t|
    t.bigint "analysis_id"
    t.bigint "user_id"
    t.bigint "viz_data_source_id"
    t.string "name", null: false
    t.text "file", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["analysis_id"], name: "index_viz_file_objects_on_analysis_id"
    t.index ["user_id"], name: "index_viz_file_objects_on_user_id"
    t.index ["viz_data_source_id"], name: "index_viz_file_objects_on_viz_data_source_id"
  end

  add_foreign_key "datasets", "users"
  add_foreign_key "samples", "projects"
end
