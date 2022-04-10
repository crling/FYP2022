class UpdateForAddingTasks < ActiveRecord::Migration[6.0]
  def change
    remove_column :users, :task_ids, :string
    remove_belongs_to :task_outputs, :analysis
  end
end
