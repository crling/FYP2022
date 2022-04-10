class Admin::AnalysesController < ApplicationController
  http_basic_authenticate_with name: "admin", password: "Lovelace"
  before_action :set_analyses_category, except: :index
  before_action :set_analysis, only: %w(edit update destroy)

  def index
    @analysis_categories = AnalysisCategory.unscoped.order(:position)
  end

  def new
    @analysis = @analysis_category.analyses.new
  end

  def create
    analysis_params[:files_info] = JSON.parse analysis_params[:files_info]
    @analysis = @analysis_category.analyses.build analysis_params

    if @analysis.save
      flash[:success] = "Analysis created."
      redirect_to admin_analyses_path
    else
      flash[:error] = @analysis.errors.full_messages
      render action: 'new'
    end
  end

  def edit

  end

  def update
    p = analysis_params
    begin
      p[:files_info] = JSON.parse p[:files_info]
    rescue
      flash[:error] = 'Please enter a valid JSON string.'
      return render 'edit'
    end
    Rails.logger.debug(p)
    if @analysis.update(p)
      flash[:success] = "Analysis updated."
      redirect_to admin_analyses_path
    else
      flash[:error] = @analysis.errors.full_messages
      redirect_to edit_admin_analysis_category_analysis_path(@analysis_category, @analysis)
    end
  end

  def destroy
    @analysis.destroy
    flash[:success] = "Analysis deleted."
    redirect_to admin_analysis_categories_path
  end

  def update_position
    params[:position].split(',').each_with_index do |id, index|
      Analysis.update id, position: index
    end
  end

  private

  def analysis_params
    p = params.require(:analysis).permit(:name, :url, :visualizer_id,
              :files_info, :documentation, :about, :references,
              :mid, :analysis_category_id, :hidden)
    if !params[:analysis][:image_file].blank?
        p[:cover_image] = "data:image/png;base64," + Base64.strict_encode64(params[:analysis][:image_file].read)
    end
    return p
  end

  def set_analyses_category
    @analysis_category = AnalysisCategory.unscoped.find(params[:analysis_category_id])
  end

  def set_analysis
    @analysis = @analysis_category.analyses.unscoped.find(params[:id])
    # @img_url = "app/assets/images/#{@analysis.mid}.png"
  end

end
