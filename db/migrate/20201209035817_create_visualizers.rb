class CreateVisualizers < ActiveRecord::Migration[6.0]
  def change
    create_table :visualizers do |t|
      t.string :name, null:false
      t.string :js_module_name, null:false
    end
  end
end
