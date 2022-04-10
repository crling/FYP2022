class AddSortingAndHidden < ActiveRecord::Migration[6.0]
  def change
    add_column :analyses, :position, :integer
    add_column :analyses, :hidden, :boolean, :default => false
    add_column :analysis_categories, :position, :integer
  end
end
