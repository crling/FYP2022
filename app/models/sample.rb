class Sample < ApplicationRecord
  belongs_to :project
  has_and_belongs_to_many :datasets
  validates :sample_name, presence: true, uniqueness: { 
    message: ->(object, data) do
      "Sample #{data[:value]} already exists. "
    end
  }, on: :create

  def self.to_csv(options={})
    CSV.generate(options) do |csv|
      csv << column_names
      all.each do |sample|
        csv << sample.attributes.values_at(*column_names)
      end
    end
  end
  
  def self.selected_to_csv(sample_ids, options={})
    CSV.generate(options) do |csv|
      csv << column_names
      sample_ids.each do |id|
        sample = Sample.find(id)
        csv << sample.attributes.values_at(*column_names)
      end
    end
  end


  def self.import(file)
    CSV.foreach(file.path, headers: true, encoding: 'bom|utf-8') do |row|
      sample = find_by_sample_name(row['sample_name'])|| new
      sample.attributes = row.to_hash.slice(*column_names)
      pname = sample.project_name
      project = Project.find_by(name: pname)
      sample.project_id = project.id
      project.update_attribute(:num_of_samples, project.samples.count)
      sample.save!
    end
  end

  def self.selected_abd_to_tsv(ids, option={})
    len = ids.length()
    if len<1
      return ""
    else
      out_json = {}
      ids.each_with_index do |id, index|
        @sample = Sample.find(id)
        @project = Project.find(@sample.project_id)
        n1 = @project.name
        n2 = @sample.sample_name
        file_current = "#{$abd_dir}#{n1}_#{n2}.tsv"
        i = index
        if (File.file?(file_current))
          File.readlines(file_current).each_with_index do |line, index2| 
            if index2 >0
              contents = line.split("\t")
              k = contents[0].chomp
              v = contents[1].chomp
              if !(out_json.key?(k))
                out_json[k] = Array.new(len, 0.0)
              end
              out_json[k][i] = v.to_f
            end
          end
        end
      end
      if option != {} && option["pj_name"]
        lefttop_name = option["pj_name"]
      else
        lefttop_name = 'selected'
      end
      keys = out_json.keys

      s1 = "#{lefttop_name}"
      ids.each_with_index do |id, index|
        @sample = Sample.find(id)
        s_name = @sample.sample_name
        s1 += "\t#{s_name}"
      end

      keys.each do |key|
        s1 += "\n"
        s1 += "#{key}"
        i = 0
        while i<len
          v = out_json[key][i]
          s1 += "\t#{v}"
          i = i+1
        end
      end

      return s1
    end
  end 

  def self.filtered(keyword, project=nil)
    search_string = []
    Sample.column_names.each do |attr|
      if Sample.columns_hash[attr].type != :string
        search_string << "cast(\"#{attr}\" as varchar(10)) like :search"
      else
        search_string << "\"#{attr}\" like :search"
      end
    end

    if(project!= nil)
      samples = project.samples.order(:sample_name)
      samples = samples.where(search_string.join(' or '), search: "%#{keyword}%")
      
    else
      samples = Sample.order(:sample_name)
      samples = samples.where(search_string.join(' or '), search: "%#{keyword}%")
      
    end
    ids = samples.ids


    return ids
  end

end
