class CreateAnalysisPipelines < ActiveRecord::Migration[6.0]
  def change
    create_table :analysis_pipelines do |t|
      t.string :name, null:false, limit: 50
      t.integer :pid
      t.text :description
      t.boolean :hidden, default: false

      t.integer :position
      t.timestamps
      
    end
  end
end
