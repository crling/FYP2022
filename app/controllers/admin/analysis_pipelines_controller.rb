class Admin::AnalysisPipelinesController < ApplicationController
  before_action :set_pipeline, only: %w(edit update destroy)
  http_basic_authenticate_with name: "admin", password: "Lovelace"
  def index
    @pipelines = AnalysisPipeline.unscoped
  end

  def new
    @pipeline = AnalysisPipeline.new
  end

  def create
    
    @pipeline = AnalysisPipeline.new pipeline_params

    if @pipeline.save
      flash[:success] = "Pipeline created."
      redirect_to admin_analysis_pipelines_path
    else
      flash[:error] = @pipeline.errors.full_messages
      render action: 'new'
    end
  end

  def edit

  end

  def update
    p = pipeline_params
    if @pipeline.update(p)
      flash[:success] = "Pipeline updated."
      redirect_to admin_analysis_pipelines_path
    else
      flash[:error] = @pipeline.errors.full_messages
      redirect_to edit_admin_analysis_pipeline_path(@pipeline)
    end
  end

  def destroy
    @pipeline.destroy
    flash[:success] = "Pipeline deleted."
    redirect_to admin_analysis_pipelines_path
  end

  def update_position
    params[:position].split(',').each_with_index do |id, index|
      AnalysisPipeline.update id, position: index
    end
  end

  private

  def pipeline_params
    p = params.require(:analysis_pipeline).permit(:name, :visualizer_id, :pid, :hidden,
                            module_requirements_attributes: {})
    if !params[:analysis_pipeline][:image_file].blank?
      p[:cover_image] = "data:image/png;base64," + Base64.strict_encode64(params[:analysis_pipeline][:image_file].read)
    end
    Rails.logger.debug p[:module_requirements_attributes]
    return p
  end

  def set_pipeline
    @pipeline = AnalysisPipeline.find(params[:id])
  end

end
