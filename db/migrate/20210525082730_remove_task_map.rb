class RemoveTaskMap < ActiveRecord::Migration[6.0]
  def change
    add_belongs_to :tasks, :analysis
    add_belongs_to :tasks, :analysis_pipeline
    add_index :task_outputs, :output_id, unique: true
  end
end
