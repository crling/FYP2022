class CreateTabixApis < ActiveRecord::Migration[5.1]
  def change
    create_table :tabix_apis do |t|
      t.string :url_name, limit: 30, index: true
      t.string :folder, limit: 1024
      t.string :column_names, limit: 1024
      t.string :column_types, limit: 256
      t.json :alias, null: false, default: {main: 'main.bgz'}

      t.timestamps
    end
  end
end

