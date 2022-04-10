class ProjectSampleDatatable < ApplicationDatatable
    private
  
    def data
      samples.map do |sample|
        [].tap do |column|
          column << ""
          Sample.column_names.each do |attr|
            if attr != 'id'
              if attr == 'sample_name'
                column << link_to("#{sample[attr]}", "https://www.ncbi.nlm.nih.gov/sra/#{sample[attr]}")
              else
                column << "<div class='table_cell'> #{sample[attr]} </div>"
              end
              
            else
              column << sample[attr]
            end
          end
          column << link_to('Show', "#{sample.project_id}/samples/#{sample.id}")
        end
      end
    end
  
    def count
      Sample.count
    end
  
    def total_entries
      samples.total_count
      # will_paginate
      # users.total_entries
    end
  
    def samples
      @samples ||= fetch_samples
    end
  
    def fetch_samples
      search_string = []
      Sample.column_names.each do |attr|
        if Sample.columns_hash[attr].type != :string
          search_string << "cast(\"#{attr}\" as varchar(10)) like :search"
        else
          search_string << "\"#{attr}\" like :search"
        end
      end
      # search_col =['sample_name', 'project_name', 'experiment_type']
      # search_col.each do |term|
      #   search_string << "#{term} like :search"
      # end
  
      # will_paginate
      # users = User.page(page).per_page(per_page)
      samples = @obj.samples.order("#{sort_column} #{sort_direction}")
      samples = samples.page(page).per(per_page)
      if params[:search][:value] != ""
        samples = samples.where(search_string.join(' or '), search: "%#{params[:search][:value]}%")
      else
        samples = samples.page(page).per(per_page)
      end
      #samples = samples.where(search_string.join(' or '), search: "%#{params[:search][:value]}%")
    end
  
    def columns
      Sample.column_names
      # %w(first_name last_name email phone_number)
    end
  end