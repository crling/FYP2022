class CreateAnalysisCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :analysis_categories do |t|
      t.string :name, null:false, unique:true
    end
  end
end
