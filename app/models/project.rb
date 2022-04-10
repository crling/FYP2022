class Project < ApplicationRecord
  has_many :samples, dependent: :destroy
  validates :name, presence: true, uniqueness: { 
    message: ->(object, data) do
      "Project #{data[:value]} already exists. "
    end
  }, on: :create

  def self.import(file)
    CSV.foreach(file.path, headers: true, encoding: 'bom|utf-8') do |row|
      project = find_by_name(row['name'])|| new
      project.attributes = row.to_hash.slice(*column_names)
      project.save!
    end
  end

  def self.to_csv(options={})
    CSV.generate(options) do |csv|
      csv << column_names
      all.each do |project|
        csv << project.attributes.values_at(*column_names)
      end
    end
  end

  def self.selected_to_csv(project_ids, options={})
    CSV.generate(options) do |csv|
      csv << column_names
      project_ids.each do |id|
        project = Project.find(id)
        csv << project.attributes.values_at(*column_names)
      end
    end
  end


end
