class AddCoverImageToAnalysis < ActiveRecord::Migration[6.0]
  def change
    add_column :analyses, :cover_image, :text  
  end
end
