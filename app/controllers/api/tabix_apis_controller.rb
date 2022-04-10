class Api::TabixApisController < ApplicationController
    before_action :set_project
    before_action :set_tabix_api
  
    def show
      col_names = @api.column_names
                      .split(',').map(&:to_sym)
                      .map.with_index { |s, i| s == :_ ? nil : [i, s] }
                      .compact.to_h
      col_types = @api.column_types.split(',')
      file_name = @api.alias[params[:name]] or raise "Cannot find the path with name #{params[:name]}"
      file_path = helpers.render_with_params File.join('data/public',
                                                       @api.folder,
                                                       file_name),
                                             @user, tabix_api_params
      begin
        tabix_file = Bio::Tabix::TFile.open(file_path)
        result = []
  
        if params[:filter]
          filter_param = params[:filter].split(':')
          filter_name = filter_param[0].to_sym
          filter_values = filter_param[1].split(',')
        end
  
        processor = lambda do |line, _len|
          values = line.split "\t"
          line_data = {}
          col_names.each_pair do |index, name|
            col_val =
              if col_types[index] == 'i'
                values[index].to_i
              elsif col_types[index] == 'f'
                values[index].to_f
              else
                values[index]
              end
            line_data[name] = col_val
          end
          result << line_data if filter_name.nil? or filter_values.include?(line_data[filter_name])
        end
  
        tabix_file.process_region tabix_api_params[:seg],
                                  tabix_api_params[:from].to_i,
                                  tabix_api_params[:to].to_i,
                                  processor
  
        tabix_file.close
  
        render json: { status: 'success', data: result }
      # rescue StandardError => e
      #   Rails.logger.debug e.message
      #   render json: { status: 'failed', message: 'Tabix error. Please contact out admin.' }
      end
    end
  
    private
  
    def tabix_api_params
      params.require(%i[name seg])
      params.with_defaults(from: 0, to: 2147483647).permit!
    end
  
    def set_tabix_api
      @api = TabixApi.find_by_url_name params[:url_name]
    end
  
    def set_project
      return unless (pid = params[:project_id])
  
      @project = Project.find pid
    end
  end
  