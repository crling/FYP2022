class CreateDatasetsAndSamples < ActiveRecord::Migration[6.0]
  def change
    create_table :datasets_samples, id: false do |t|
      t.belongs_to :dataset, index: true
      t.belongs_to :sample, index: true
    end
  end
end
