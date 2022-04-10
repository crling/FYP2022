class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    create_table :projects do |t|
      t.string :name
      t.string :project_id1
      t.string :project_id2
      t.text :curated_description
      t.integer :num_of_samples
      t.integer :num_of_runs
      t.integer :population
      t.text :related_publications
      t.text :original_description

      t.timestamps
    end
  end
end
