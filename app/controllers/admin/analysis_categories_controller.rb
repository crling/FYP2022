class Admin::AnalysisCategoriesController < ApplicationController
  http_basic_authenticate_with name: "admin", password: "Lovelace"
  before_action :set_analyses_categories
  before_action :set_analyses_category, only: %w(edit update destroy)

  def index
  end

  def new
    @analysis_category = AnalysisCategory.new
  end

  def create
    @analysis_category = AnalysisCategory.new analysis_category_params

    if @analysis_category.save
      flash[:success] = "Analysis Category created."
      redirect_to admin_analysis_categories_path
    else
      flash[:error] = @analysis_category.errors.full_messages
      render action: 'new'
    end
  end

  def update
    if @analysis_category.update analysis_category_params
      flash[:success] = "Analysis Category updated."
      redirect_to admin_analysis_categories_path
    else
      flash[:error] = @analysis.errors.full_messages
      redirect_to edit_admin_analysis_category_path(@analysis_category, @analysis)
    end
  end

  def destroy
    @analysis_category.destroy
    flash[:success] = "Analysis Category deleted."
    redirect_to admin_analysis_categories_path
  end

  def update_position
    params[:position].split(',').each_with_index do |id, index|
      AnalysisCategory.update id, position: index + 1
    end
  end

  private

  def analysis_category_params
    params.require(:analysis_category).permit(:name)
  end

  def set_analyses_categories
    @analysis_categories = AnalysisCategory.unscoped.order(:position)
  end

  def set_analyses_category
    @analysis_category = AnalysisCategory.unscoped.find(params[:id])
  end

end
