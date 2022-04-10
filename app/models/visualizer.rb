class Visualizer < ApplicationRecord
    has_many :analyses
    has_many :viz_data_sources
    accepts_nested_attributes_for :viz_data_sources, allow_destroy: true

    def self.import(file)
        CSV.foreach(file.path, headers: true, encoding: 'bom|utf-8') do |row|
          v = find_by_name(row['name'])|| new
          v.attributes = row.to_hash.slice(*column_names)
          v.save!
        end
    end
end
