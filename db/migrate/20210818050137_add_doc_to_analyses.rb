class AddDocToAnalyses < ActiveRecord::Migration[6.0]
  def change
    add_column :analyses, :documentation, :text
    add_column :analyses, :references, :text
    add_column :analyses, :about, :text
    add_column :analyses, :rendered_ref, :text
    add_column :analyses, :rendered_doc, :text
    add_column :analyses, :rendered_about, :text
  end
end
