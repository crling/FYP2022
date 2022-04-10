class CreateVizDataSources < ActiveRecord::Migration[6.0]
  def change
    create_table :viz_data_sources do |t|
      t.string :data_type, null:false
      t.boolean :optional, default:false
      t.boolean :allow_multiple, default:false
      t.belongs_to :visualizer
      
    end
  end
end
