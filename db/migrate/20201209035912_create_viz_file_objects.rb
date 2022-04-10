class CreateVizFileObjects < ActiveRecord::Migration[6.0]
  def change
    create_table :viz_file_objects do |t|
      t.belongs_to :analysis
      t.belongs_to :user
      t.belongs_to :viz_data_source
      t.string :name, null:false
      t.text :file, null:false
      t.timestamps
    end
  end
end
