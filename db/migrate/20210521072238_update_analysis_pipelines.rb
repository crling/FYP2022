class UpdateAnalysisPipelines < ActiveRecord::Migration[6.0]
  def change
    add_column :analysis_pipelines, :cover_image, :text
  end
end
