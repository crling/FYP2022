class CreatePublicFileApis < ActiveRecord::Migration[6.0]
  def change
    create_table :public_file_apis do |t|
      t.string :url_name, limit: 30, index: true
      t.string :path, limit: 1024
      
      t.timestamps
    end
  end
end
