class SubmitController < ApplicationController
  UID = 45
  PROJECT_ID = 289
  # $user_stor_dir = "#{Rails.root}/data/user"
  def analyses
    @analyses = Analysis.where "mid is not null"
  end

  def pipelines
    @pipelines = AnalysisPipeline.all
  end
  
  def query_app_task_test
    @result_json = {
      code: false,
      data: ''
    }
    @result_message = []
    
    begin
      client = LocalApi::Client.new
      @result_message << client.task_info(UID, 243, 'pipeline')
      @result_message << client.task_info(UID, 252, 'pipeline')
      @result_message << client.task_info(UID, 253, 'pipeline')
    rescue StandardError => e
      @result_json[:code] = false
      @result_json[:data] = e.message
    end
  end

  def index
    id = params[:id]
    gon.push id: id
    uid = session[:user_id]
    @user = User.find(uid)
    # user_dir = File.join($user_stor_dir, uid.to_s)
    @datasets = @user.datasets
    data = {}
    @datasets.each do |ds|
      ds_name = ds.name
      # ds_dir = File.join(user_dir, ds_name)
      # file_list = Dir.entries(ds_dir)[2..-1]
      data[ds_name] = ds_name
    end
    gon.push select_box_option: data

  end

  def query
    id = params[:id]
    uid = session[:user_id]
    @user = User.find(uid)
    # user_dir = File.join($user_stor_dir, @user.id.to_s)
    if @user.task_ids
      @task_list = @user.task_ids.split(',')
    else
      @task_list = []
    end
    gon.push tasks: @task_list
  end

  def pipeline
    id = params[:id]
    gon.push id: id
    uid = session[:user_id]
    @user = User.find(uid)
    # user_dir = File.join($user_stor_dir, uid.to_s)
    @datasets = @user.datasets
    data = {}
    @datasets.each do |ds|
      ds_name = ds.name
      # ds_dir = File.join(user_dir, ds_name)
      # file_list = Dir.entries(ds_dir)[2..-1]
      data[ds_name] = ds_name
    end
    gon.push select_box_option: data
  end

  def query_all # query all tasks by user
    @tasks = Task.where("user_id = ?", session[:user_id])
    parsed_jobs = []
    result = nil
    @tasks.each do |t|
      # submit task
      if t.status == 'running' || t.status == "submitted"
        client = LocalApi::Client.new
        if !t.analysis.blank?
          result = client.task_info(UID, t.tid, 'app')
        else
          result = client.task_info(UID, t.tid, 'pipeline')
        end
        Rails.logger.debug "=====>"
        Rails.logger.debug([result['status'], result['message']['status']])
        Rails.logger.debug result
        if result['status'] == 'success'
          t.status = result['message']['status'] if !result['message']['status'].blank?
          t.save!
        end
      end
      if !t.analysis.blank?
        jobName = t.analysis.name
      else
        jobName = t.analysis_pipeline.name
      end
      parsed_jobs.push({
        jobName: jobName,
        jobId: t.id,
        created: t.created_at,
        status: t.status,
      })
    end
    render json:parsed_jobs
  end

  def query_app_task_dummy
    return_json_hash = {"status":"success", "message":{"status":"", "type":"pipeline", "inputs":[], "outputs":[], "params":[], "tasks":[{"status":"finished", "module_id":645, "name":"gutmeta_beta_diversity", "outputs":[{"id":878, "name":"beta_diversity", "desc":"beta diversity", "files":[{"name":"k_test_result.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"k_compare_group.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"k_Beta_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"p_test_result.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"p_compare_group.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"p_Beta_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"c_test_result.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"c_compare_group.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"c_Beta_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"o_test_result.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"o_compare_group.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"o_Beta_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"f_test_result.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"f_compare_group.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"f_Beta_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"g_test_result.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"g_compare_group.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"g_Beta_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"s_test_result.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"s_compare_group.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"s_Beta_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"t_test_result.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"t_compare_group.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"t_Beta_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"group_info.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}]}]}, {"status":"finished", "module_id":666, "name":"meta_alpha_diversity", "outputs":[{"id":908, "name":"alpha_diversity", "desc":"alpha diversity", "files":[{"name":"Alpha_diversity_pvalue.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_alpha_diversity/bUT8BVcs4vWonCY7DWKofd/output"}, {"name":"Alpha_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_alpha_diversity/bUT8BVcs4vWonCY7DWKofd/output"}, {"name":"group_info.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_alpha_diversity/bUT8BVcs4vWonCY7DWKofd/output"}]}]}], "error_message":""}}
   
    # @task = Task.find_by! id:params[:job_id], user_id:session[:user_id]
    @task = Task.find_by! id:params[:job_id], user_id:session[:user_id]

    # Rails.logger.debug @task
    result = JSON.parse(return_json_hash.to_json)

    if @task.status === 'submitted'
      @task.status = result['message']['status'] if !result['message']['status'].blank?
      @task.save!
    end

    response_body = []

    if TaskOutput.where(task_id:@task.id).exists? 
      task_outputs = TaskOutput.where(task_id:@task.id)
      task_outputs.each do |otp|
        @task_output = otp
        @analysis = otp.analysis
        parsed_output = processTaskOutput()
        response_body << parsed_output
      end
    elsif !@task.analysis.blank? # module task
      @analysis = @task.analysis
      @task_output = create_task_output(result['message'])
      parsed_output = processTaskOutput()
      response_body << parsed_output
    else
      @response_body = []
      result['message']['tasks'].each do |mrs|
        @analysis = Analysis.find_by(mid:mrs['module_id'])
        @task_output = create_task_output(mrs)
        parsed_output = processTaskOutput()
        response_body << parsed_output
      end
    end

    render json: response_body
  end

  def submit_app_task_dummy
    uid = session[:user_id]
    @user = User.find(uid)
    user_dir = File.join($user_stor_dir, uid.to_s)

    result_json = {
      code: false,
      data: ''
    }
    begin
      app_id = params[:app_id]
      app_inputs = params[:inputs]
      app_params = params[:params]
      app_selected = params[:selected]
      is_pipeline = params[:is_pipeline]
      if !params[:mid].blank?
        @analysis = Analysis.find_by mid:params[:mid]
      else
        @pipeline = AnalysisPipeline.find_by pid:params[:pid]
      end

      # submit task

      result_hash = {status:"success", 
        message:{code:true, data:{msg:"Task submitted.", task_id:237}}}
      result = JSON.parse(result_hash.to_json)
      if result['message']['code']
        result_json[:code] = true
        @task  = @user.tasks.new
        @task.status = 'submitted'
        @task.tid = result['message']['data']['task_id']
        if is_pipeline
          @task.analysis_pipeline = @pipeline
          @task.analysis = nil
        else
          @task.analysis = @analysis
          @task.analysis_pipeline = nil
        end
        @task.save!
        @user.updated_at = Time.now
        @user.save!
        result_json[:data] = {
          'msg': result['message']['data']['msg'],
          'task_id': @task.id
        }  
      else
        result_json[:code] = false
        result_json[:data] = {
          'msg': result['message']
        }
        
      end
    rescue StandardError => e
      result_json[:code] = false
      result_json[:data] = e.message
    end
    render json: result_json
  end

  def submit_app_task
    uid = session[:user_id]
    @user = User.find(uid)
    # user_dir = File.join($user_stor_dir, uid.to_s)
    result_json = {
      code: false,
      data: ''
    }
    begin
      app_id = params[:app_id]
      app_inputs = params[:inputs]
      app_params = params[:params]
      app_selected = params[:selected]
      is_pipeline = params[:is_pipeline]
      # @analysis = Analysis.find_by mid:params[:mid]
      if !params[:mid].blank?
        @analysis = Analysis.find_by mid:params[:mid]
      else
        @pipeline = AnalysisPipeline.find_by pid:params[:pid]
      end
      inputs = Array.new
      params = Array.new

      
      # store selected file to user's data folder
      app_selected&.each do |k, v|
        next unless !v.blank?
        ds_name = v
        @dataset = @user.datasets.find_by(name: v)
        data = @dataset.abd_file()
        # file_path = File.join(user_dir, ds_name, file_name)
        # fix the source of file
        # file = File.open file_path
        
        time = Time.now
        time_str = time.strftime("%Y_%m_%d")       
        time_str += ("_" + time.strftime("%k_%M")) 
        time_str = time_str.gsub(' ','')
        file_name = "#{ds_name}_abd.tsv"
        file = File.new(file_name, 'w')
        file.write(data)
        uploader = JobInputUploader.new
        uploader.store!(file)
                
        inputs.push({
          k => '/data/' + file_name
        })
        file.close
        
      end

      # store input file to user's data folder
      app_inputs&.each do |k, v|
        uploader = JobInputUploader.new
        uploader.store!(v)
        unless v.nil? || v == ""
                inputs.push({
                  k => '/data/' + v.original_filename,
                })
        end
      end
      
      app_params&.each do |p|
        p.each do |k, v|
          params.push({
            k => v,
          })
        end
      end
      
      
      # submit task
      client = LocalApi::Client.new
      if is_pipeline 
        result = client.run_pipeline(UID, PROJECT_ID, app_id.to_i, inputs, params)
      else
        result = client.run_module(UID, PROJECT_ID, app_id.to_i, inputs, params)
      end
      # Rails.logger.info(result['message'])
      Rails.logger.debug "===========>"
      Rails.logger.info(result)
      if result['message']['code']
        result_json[:code] = true
        @task  = @user.tasks.new
        if is_pipeline
          @task.analysis_pipeline = @pipeline
          @task.analysis = nil
        else
          @task.analysis = @analysis
          @task.analysis_pipeline = nil
        end
        @task.status = 'submitted'
        @task.tid = result['message']['data']['task_id']
        @task.save!
        @user.updated_at = Time.now
        @user.save!
        result_json[:data] = {
          'msg': result['message']['data']['msg'],
          'task_id': @task.id
        }
      else
        result_json[:code] = false
        result_json[:data] = {
          'msg': result['message']
        }
        
      end
    rescue StandardError => e
      result_json[:code] = false
      result_json[:data] = e.message
    end
    render json: result_json
  end

  def query_app_task
    result_json = {
      code: false,
      data: ''
    }
    begin
      @task = Task.find_by! id:params[:job_id], user_id:session[:user_id]
      
      if TaskOutput.where(task_id:@task.id).exists?
        response_body = []
        task_outputs = TaskOutput.where(task_id:@task.id)
        task_outputs.each do |otp|
          @task_output = otp
          @analysis = otp.analysis
          parsed_output = processTaskOutput()
          response_body << parsed_output
        end
        render json: response_body
        return
      end
      # query task
      client = LocalApi::Client.new
      result = ''
      if !@task.analysis.blank?
        result = client.task_info(UID, @task.tid, 'app')
      else
        result = client.task_info(UID, @task.tid, 'pipeline')
      end
      Rails.logger.info(result)

      if @task.status == 'submitted'
        @task.status = result['message']['status'] if !result['message']['status'].blank?
        @task.save!
      end


      if result['status'] == 'success'
        response_body = []

        @task_output = {}
        
        if result['message']['status'] == 'finished'
          if result['message']['type'] == "module" # module task
            @analysis = @task.analysis
            @task_output = create_task_output(result['message'])
            parsed_output = processTaskOutput()
            response_body << parsed_output
          else
            @response_body = []
            result['message']['tasks'].each do |mrs|
              @analysis = Analysis.find_by(mid:mrs['module_id'])
              @task_output = create_task_output(mrs)
              parsed_output = processTaskOutput()
              response_body << parsed_output
            end
          end
        end
        render json: response_body
        return
      else
        result_json[:data] = result['message']
      end
     
    rescue StandardError => e
      result_json[:code] = false
      result_json[:data] = e.message
    end
    render json: result_json
  end

  def remove_task
    @task = Task.find params[:job_id]
    @analysis_user_datum = AnalysisUserDatum.find_by task_output: @task.task_outputs[0]
    @analysis_user_datum.task_output = nil
    @analysis_user_datum.use_demo_file = true
    @analysis_user_datum.save!
    @task.destroy!
    render json:{code:true}
  end

  private

  def process_module_result
  
  end

  # TODO 写好看点
  def create_task_output(mrs)
    #   {
    #     "id":671,
    #     "name":"meta_module_double_input_test",
    #     "outputs":[
    #        {
    #           "id":911,
    #           "name":"output",
    #           "desc":"output of double testing",
    #           "files":[
    #              {
    #                 "name":"test_double_output.txt",
    #                 "path":"/project/platform_task_test/gutmeta_pipeline_test1/task_20210517132818/DOAP_meta_module_double_input_test/3P4dmDkcKjCAJANvPLmiwj/output"
    #              }
    #           ]
    #        }
    #     ]
    #  }
    # @task, @analysis
    
    task_output = @task.task_outputs.new
    task_output.analysis = @analysis
    file_paths = {}
    files_to_do = mrs['outputs'][0]['files']
    
    @analysis.files_info.each do |dataType, info|
      @viz_data_source = VizDataSource.find_by(data_type:dataType)
      if @viz_data_source.allow_multiple
        files_to_do.each do |of1|
          info['outputFileName'].each do |fName|
            if matchPattern(of1['name'], fName)
              file_paths[dataType] = [] if file_paths[dataType].blank?
              file_paths[dataType] << {id: 0, 
                                      url: File.join('/data/outputs', of1['path'], of1['name']), 
                                      is_demo: true}
              files_to_do.delete(of1)
            end
          end
        end
      else
        files_to_do.each do |of1|
          if of1['name'] == info['outputFileName']
            file_paths[dataType] = {id: 0, 
                                    url: File.join('/data/outputs', of1['path'], of1['name']), 
                                    is_demo: true}
            files_to_do.delete(of1)
          end
        end
      end
    end

    task_output.file_paths = file_paths
    task_output.output_id = 0
    task_output.save!
    return task_output
  end

  def processTaskOutput
    @analysis_user_datum = AnalysisUserDatum.findOrInitializeBy @analysis.id, session[:user_id]
    @analysis_user_datum.task_output = @task_output
    @analysis_user_datum.use_demo_file = false
    @analysis_user_datum.save!
    parsed_output = {}
    parsed_output['module_name'] = @analysis.visualizer.js_module_name
    parsed_output['name'] = @analysis.name
    parsed_output['analysis_id'] = @analysis.id
    parsed_output['required_data'] = @analysis.files_info.keys
    return parsed_output
  end

  def encode(id)
    hashids = Hashids.new("this is my salt", 16)
    hashids.encode(id)
  end
  def decode(id)
    hashids = Hashids.new("this is my salt", 16)
    hashids.decode(id)[0]
  end

  def matchPattern(name, pattern)
    if pattern.include? "*"
      p = pattern.split "*"
      p.each do |x|
        return false if !name.include? x
      end
      return true
    else 
      return pattern == name
    end
  end
end
