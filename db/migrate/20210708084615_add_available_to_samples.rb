class AddAvailableToSamples < ActiveRecord::Migration[6.0]
  def change
    add_column :samples, :abundance_available, :string
  end
end
