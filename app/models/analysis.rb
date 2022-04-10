class Analysis < ApplicationRecord
  after_find  :render_fields
    
    has_many :tasks

    has_many :viz_file_objects
    has_many :analysis_user_data
    has_many :task_outputs
    belongs_to :analysis_category
    belongs_to :visualizer
    has_many :analysis_pipelines, through: :module_requirements

    def self.import(file)
        CSV.foreach(file.path, headers: true, encoding: 'bom|utf-8') do |row|
          a = find_by_name(row['name'])|| new
          a.attributes = row.to_hash.slice(*column_names)
          a.files_info = JSON.parse a.files_info
          a.save!
        end
    end

    def files_info_json
      JSON.pretty_generate self.files_info
    end
    
    private

    def render_fields
      markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, tables: true, fenced_code_blocks: true)
      # FIXME: should be DRY
      self.rendered_doc = markdown.render(documentation.nil? ? '' : documentation)
      self.rendered_ref = markdown.render(references.nil? ? '' : references)
      self.rendered_about = markdown.render(about.nil? ? '' : about)
      # self.updates = extract_update.then { |u| u.nil? ? '' : markdown.render(u) }
    end

    def extract_update
      return nil if about.nil?
  
      lines = about.split("\n")
      i = lines.find_index { |l| l.starts_with?('#') and l.include?('Updates') }
      return nil if i.nil?
  
      i += 1
      j = lines.drop(i).find_index { |l| l.starts_with?('#') }
      return nil if j.nil?
  
      j += i
      lines.drop(j + 1).take_while { |l| !l.starts_with?('#') }.prepend(lines[j])
           .map(&:strip).reject(&:empty?).join("\n")
    end
end
