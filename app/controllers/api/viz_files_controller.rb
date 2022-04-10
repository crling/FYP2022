class Api::VizFilesController < ApplicationController
  before_action :instantiate_models

    def use_task_output # analysis_id, task_output_id
        if params[:task_output_id] == '0'
            if @analysis_user_datum.task_output.nil?
                render json:{}
                return
            end
            @analysis_user_datum.task_output = nil
            @analysis_user_datum.use_demo_file = true
            @analysis_user_datum.save!
            render json:{code:true}
            return
        end
        @task_output = TaskOutput.find(params[:task_output_id])
        if @task_output == @analysis_user_datum.task_output
            render json:{}
            return
        end
        @analysis_user_datum.task_output = @task_output
        @analysis_user_datum.use_demo_file = false
        @analysis_user_datum.save!       
        render json:{code:true}
    end

    def use_demo
        if @analysis_user_datum.use_demo_file
            render json:{}
            return
        else
            @analysis_user_datum.use_demo_file = true
            @analysis_user_datum.save!
        end
        render json:{code:true}
    end

    def all_files
        data = []
        files_info = @analysis.files_info
        @viz_data_sources = @analysis.visualizer.viz_data_sources
        files_info.each do |dataType, info|
            vds = @viz_data_sources.find_by(data_type:dataType)
            files = vds.viz_file_objects.where analysis:@analysis, user:@user
            data << {
                id: vds.id,
                name: info['name'],
                dataType: dataType,
                optional: vds.optional,
                multiple: vds.allow_multiple,
                files: files || []
            }
        end
        render json: data
    end

    def all_task_outputs
        @tasks = Task.where("user_id = ?", @user.id)
        tasks_ids = @tasks.map{|t| t.id}
        @task_output = TaskOutput.where("task_id in (?) and analysis_id = ?",
            tasks_ids, @analysis.id)
        render json: @task_output.map { |opt|
             {id: opt.id, task_id: opt.task.id, task_id: opt.id}
        }
        
    end

    def chosen_file_paths
        
        files_info = @analysis.files_info
        all_viz_data = @analysis.visualizer.viz_data_sources.map{|d| d.data_type}
        
        if @analysis_user_datum.use_demo_file
            render json: {}.tap { |x|
                all_viz_data.each do |dataType| 
                    if files_info[dataType].blank? || files_info[dataType]['demoFilePath'].blank?
                        x[dataType] = nil
                    elsif files_info[dataType]['demoFilePath'].class == String
                        x[dataType] = {id: 0, 
                            url: files_info[dataType]['demoFilePath'], 
                            is_demo: true}
                    else
                        x[dataType] = files_info[dataType]['demoFilePath'].map do |fPath|
                            {id: 0, 
                            url: fPath, 
                            is_demo: true}
                        end
                    end
                end
            }
            return
        end
        if !@analysis_user_datum.task_output.blank?
            info = @analysis_user_datum.task_output.file_paths
            render json:{}.tap { |x|
                all_viz_data.each do |dataType| 
                    if info[dataType].blank? 
                        x[dataType] = nil
                    else
                        x[dataType] = info[dataType]
                    end
                end
            }
            return
        end
        all_viz_data = @analysis.visualizer.viz_data_sources
        render json: {}.tap { |x|
            all_viz_data.each do |viz_data|
                dataType = viz_data.data_type
                if @analysis_user_datum.chosen[dataType].blank? 
                    x[dataType] = nil
                elsif viz_data.allow_multiple
                    x[dataType] = [] 
                    all_files = VizFileObject.where("user_id = ? AND analysis_id = ? AND viz_data_source_id = ?", 
                        @analysis_user_datum.user.id,
                        @analysis_user_datum.analysis.id,
                        viz_data.id)
                    all_files.each do |vFile| 
                        x[dataType].push({ id: vFile.id,
                            url: vFile.file.url 
                        })
                    end
                else
                    fileId = @analysis_user_datum.chosen[dataType]
                    x[dataType] = { id: fileId,
                        url: VizFileObject.find(fileId).file.url 
                    }
                end
            end
        }
    end

    def get_chosen_files
        render json: {
                use_demo: @analysis_user_datum.use_demo_file,
                chosen: @analysis_user_datum.chosen
            } 
        
    end

    def update_chosen_files
        data = []
        chosen = @analysis_user_datum.chosen
        @analysis.files_info.keys.each do |dataType|
            next unless !params["_f_#{dataType}"].blank?
            if params["_f_#{dataType}"] == 'null'
                chosen.except! dataType
            else    
                vfo = VizFileObject.find(params["_f_#{dataType}"])
                data << vfo
                chosen[dataType] = vfo.id
            end
        end
        @analysis_user_datum.chosen = chosen
        if @analysis_user_datum.use_demo_file
            @analysis_user_datum.use_demo_file = false
        end
        @analysis_user_datum.save!
        render json: { status: 'ok', files: data }
    end

    def create_files
        return head 422 unless request.xhr?
        
        result = {}
        chosen = @analysis_user_datum.chosen
        params.each do |key, file|
            next unless key.start_with? '_f_'
            dataType = key.delete_prefix('_f_')
            vfo = VizFileObject.new
            vfo.user = @user
            vds = VizDataSource.find_by data_type:dataType
            vfo.viz_data_source = vds
            vfo.analysis = @analysis
            vfo.file = file
            vfo.name = params["_fn_#{dataType}"]
            vfo.save!
            
            result[dataType] = { id: vfo.id }
            chosen[dataType] = vfo.id
        end
        @analysis_user_datum.chosen = chosen
        @analysis_user_datum.save!

        render json: { status: 'ok', files: result }
    end

    def batch_delete_files
        file_ids = params[:file_ids]
        VizFileObject.find(file_ids).each do |file|
          continue unless file.analysis == @analysis
          dataType = file.viz_data_source.data_type
          chosen_json = @analysis_user_datum.chosen
          if (chosen_json[dataType] == file.id)
            chosen_json[dataType] = nil
            @analysis_user_datum.chosen = chosen_json
            @analysis_user_datum.save!
          end
          file.destroy
        
        end
        # check if any analysis has selected deleted files.
        # if so, set them to nil.
        # Analysis.find_each do |analysis|
        #   datum = AnalysisUserDatum.find_by project: @project, analysis: analysis
        #   next if datum.nil?
        #   changed = false
        #   new_data = datum.chosen_files.transform_values do |fid|
        #     if file_ids.include? fid
        #       changed = true
        #       next nil
        #     end
        #     fid
        #   end
        #   next unless changed
        #   datum.chosen_files = new_data
        #   datum.save
        # end
    
        # @project.update_filesize
    end
    # def demo_files
    #     data = {}
    #     if @analysis_user_datum.use_demo_file
    #         data = @analysis.demo_files
    #     end
    #     render json: data
    # end

    def download_demo_file
        files_info = @analysis.files_info
        # all_viz_data = @analysis.visualizer.viz_data_sources.map{|d| d.data_type}
        all_files = []
        if @analysis_user_datum.use_demo_file
            files_info.each do |dataType, d|
                fName = d['name']
                if d['demoFilePath'].class == String
                    all_files << [fName, d['demoFilePath']]
                else
                    d['demoFilePath'].each do |fPath|
                        all_files << [fName, fPath]
                    end
                end
            end
        end
        if !@analysis_user_datum.task_output.blank?
            info = @analysis_user_datum.task_output.file_paths
            info.each do |dataType, d|
                fName = files_info[dataType]['name']
                if d.class == Array
                    d.each do |fInfo, i|
                        all_files << [fName, fInfo['url']]
                    end
                else
                    all_files << [fName, d['url']]
                end
            end
            
        end
        if all_files.size == 1
            send_file File.join(Rails.root, all_files[0][1])
            return
        end
        compressed_filestream = Zip::OutputStream.write_buffer(::StringIO.new()) do |zos|
            all_files.each do |fpath|
              zos.put_next_entry "#{fpath[0]}__#{File.basename(fpath[1])}"
              zos.write File.read(File.join(Rails.root, fpath[1]))
            end
        end
        compressed_filestream.rewind
        send_data compressed_filestream.read, filename: "#{@analysis.name}.zip"
    end
    # def download_demo_file
    #     file_set = []
    #     files_info = @analysis.files_info
    #     files_info.each do |dataType, dataInfo| 
    #       next unless !dataInfo['demoFilePath'].blank?
    #       if dataInfo['demoFilePath'].class == String
    #         file_set << dataInfo['demoFilePath']
    #       else
    #         dataInfo['demoFilePath'].each do |fPath|
    #             file_set << fPath
    #           end
    #       end
    #     end
    
    #     if file_set.size == 1
    #         send_file File.join(Rails.root, file_set.values.first)
    #         return
    #     end
    
    #     compressed_filestream = Zip::OutputStream.write_buffer(::StringIO.new()) do |zos|
    #         file_set.each do |fpath|
    #           zos.put_next_entry File.basename(fpath)
    #           zos.write File.read(File.join(Rails.root, fpath))
    #         end
    #     end
    
    #     compressed_filestream.rewind
    #     send_data compressed_filestream.read, filename: "#{@analysis.name}.zip"

    # end

    def instantiate_models
        @analysis = Analysis.find(params[:analysis_id])
        @user = User.find(session[:user_id])
        @analysis_user_datum = AnalysisUserDatum.find_by analysis:@analysis, user: @user
    end
end
