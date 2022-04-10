class CreateSamples < ActiveRecord::Migration[6.0]
  def change
    create_table :samples do |t|
      t.string :sample_name
      t.string :project_name
      t.string :run_id
      t.string :second_run_id
      t.string :meta_project_id
      t.string :experiment_type
      t.string :nr_reads_sequenced
      t.string :instrument_model
      t.string :disease_phenotype
      t.string :is_disease_stage_available
      t.string :disease_stage
      t.text :more
      t.text :more_info
      t.string :country
      t.string :collection_date
      t.string :sex
      t.integer :host_age
      t.string :diet
      t.string :longitude
      t.string :lattitude
      t.float :BMI
      t.string :associated_phenotype
      t.string :QC_status
      t.text :recent_antibiotics_use
      t.text :antibiotics_used
      t.text :antibiotics_dose
      t.integer :days_without_antibiotics_use
      t.text :original_description
      t.text :curated_description
      t.references :project, null: false, foreign_key: true

      t.timestamps
    end
  end
end
