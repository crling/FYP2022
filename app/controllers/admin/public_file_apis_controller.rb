class Admin::PublicFileApisController < ApplicationController
    before_action :set_api, only: %i[show edit update destroy]
  
    def index
      @apis = PublicFileApi.order(:id)
    end
  
    def new
      @api = PublicFileApi.new
    end
  
    def create
      @api = PublicFileApi.new api_params
      if @api.save
        flash[:success] = 'API created.'
        redirect_to admin_public_file_apis_path
      else
        flash[:error] = @api.errors.full_messages
        render 'new'
      end
    end
  
    def show
    end
  
    def edit
    end
  
    def update
      if @api.update api_params
        flash[:success] = 'API updated.'
        redirect_to edit_admin_public_file_api_path(@api)
      else
        flash[:error] = @api.errors.full_messages
        render 'edit'
      end
    end
  
    def destroy
      @api.destroy
      redirect_to admin_public_file_apis_path
    end
  
    private
  
    def api_params
      p = params.require(:public_file_api).permit(:url_name, :path)
    end
  
    def set_api
      @api = PublicFileApi.find params[:id]
    end
  end
  