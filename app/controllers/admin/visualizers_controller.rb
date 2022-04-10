class Admin::VisualizersController < ApplicationController
  http_basic_authenticate_with name: "admin", password: "Lovelace"
  before_action :set_visualizers
  before_action :set_visualizer, only: %w(edit update destroy)

  def index
  end

  def new
    @visualizer = Visualizer.new
  end

  def create
    @visualizer = Visualizer.new visualizer_params

    if @visualizer.save
      flash[:success] = "Analysis Category created."
      redirect_to admin_visualizers_path
    else
      flash[:error] = @visualizer.errors.full_messages
      render action: 'new'
    end
  end

  def update
    Rails.logger.debug visualizer_params
    if @visualizer.update visualizer_params
      flash[:success] = "Visualizer updated."
      redirect_to admin_visualizers_path
    else
      flash[:error] = @visualizer.errors.full_messages
      redirect_to edit_admin_visualizer_path(@visualizer)
    end
  end

  def destroy
    @visualizer.destroy
    flash[:success] = "Visualizer deleted."
    redirect_to admin_visualizer_path
  end

  private

  def visualizer_params
    params.require(:visualizer).permit(:name, :js_module_name, viz_data_sources_attributes:{})
  end

  def set_visualizers
    @visualizers = Visualizer.unscoped
  end

  def set_visualizer
    @visualizer = Visualizer.unscoped.find(params[:id])
  end

end
