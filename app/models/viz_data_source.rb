class VizDataSource < ApplicationRecord
    belongs_to :visualizer
    has_many :viz_file_objects
    
    def self.import(file)
        CSV.foreach(file.path, headers: true, encoding: 'bom|utf-8') do |row|
          vds = find_by_id(row['id'])|| new
          vds.attributes = row.to_hash.slice(*column_names)
          vds.save!
        end
    end
end
