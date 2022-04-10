class AnalysisController < ApplicationController
    before_action :instantiate_sidebar
   
    def index
        aurl = @analysis_categories[0].analyses[0].url
        redirect_to action: "show", url_name: aurl
    end
    def show 
        @analysis = Analysis.find_by url:params[:url_name]
        files_info = @analysis.files_info
        
        @analysisUserDatum = AnalysisUserDatum.findOrInitializeBy @analysis.id, session[:user_id]
        chosen_output = nil
        chosen_output = @analysisUserDatum.task_output.id if !@analysisUserDatum.task_output.blank?
        gon.push module_name: @analysis.visualizer.js_module_name,
                viz_mode: "analysis",
                analysis_name: @analysis.name,
                required_data: files_info.keys, 
                chosen_output: chosen_output,
                urls: {
                use_demo: api_analysis_use_demo_path(@analysis),
                use_task_output: api_analysis_use_task_output_path(@analysis),
                create_file: api_analysis_create_files_path(@analysis),
                all_files: api_analysis_all_files_path(@analysis),
                all_task_outputs: api_analysis_all_task_outputs_path(@analysis),
                chosen_files: api_analysis_chosen_files_path(@analysis),
                chosen_file_paths: api_analysis_chosen_file_paths_path(@analysis),
                batch_delete_files: api_analysis_batch_delete_files_path(@analysis),
                download_demo_file: api_analysis_download_demo_file_path(@analysis),
            }

    end

    def instantiate_sidebar 
        @analysis_categories = AnalysisCategory.unscoped
                        .order(:position).select {|ac| ac.analyses.length > 0 }
        if session[:user_id].blank? || !User.exists?(session[:user_id])
            user = User.create
            session[:user_id] = user.id
        end
    end
end
