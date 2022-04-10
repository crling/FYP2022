class CreateModuleRequirements < ActiveRecord::Migration[6.0]
  def change
    create_table :module_requirements do |t|
      t.belongs_to :analysis, index: true
      t.belongs_to :analysis_pipeline, index: true
    end
  end
end
