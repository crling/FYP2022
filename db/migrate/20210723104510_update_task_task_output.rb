class UpdateTaskTaskOutput < ActiveRecord::Migration[6.0]
  def change
    remove_column :task_outputs, :task_id, :string
    add_belongs_to :task_outputs, :task
  end
end
