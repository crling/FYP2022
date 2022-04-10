class CreateTaskOutputs < ActiveRecord::Migration[6.0]
  def change
    create_table :task_outputs do |t|
      t.belongs_to :user
      t.string :task_id, null:false
      t.integer :output_id, null:false
      t.json :file_paths, null:false
    end
  end
end
