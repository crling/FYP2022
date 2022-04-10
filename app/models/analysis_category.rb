class AnalysisCategory < ApplicationRecord
    default_scope { order(:position) }
    has_many :analyses, -> { where(hidden: false).order(:position) }
    validates :name, presence: true

    def self.import(file)
        CSV.foreach(file.path, headers: true, encoding: 'bom|utf-8') do |row|
          ac = find_by_name(row['name'])|| new
          ac.attributes = row.to_hash.slice(*column_names)
          ac.save!
        end
    end
end
