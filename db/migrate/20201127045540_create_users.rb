class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :name
      t.integer :dataset_n
      t.string :task_ids
      t.timestamps
    end
  end
end
