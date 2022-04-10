class UpdateTaskDesign < ActiveRecord::Migration[6.0]
  def change
    remove_belongs_to :tasks, :analysis
    add_belongs_to :task_outputs, :analysis
  end
end
