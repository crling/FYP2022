class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.belongs_to :user
      t.belongs_to :analysis
      t.integer :tid, null:false
      t.string :status, null:false
      t.timestamps
    end
  end
end
