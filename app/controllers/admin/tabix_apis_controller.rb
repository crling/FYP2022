class Admin::TabixApisController < ApplicationController
    before_action :set_api, only: %i[show edit update destroy]
  
    def index
      @apis = TabixApi.order(:id)
    end
  
    def new
      @api = TabixApi.new
    end
  
    def create
      p = api_params
      begin
        p[:alias] = JSON.parse p[:alias]
      rescue
        flash[:error] = 'Please enter a valid JSON string.'
        p[:alias] = nil
        @api = TabixApi.new p
        return render 'new'
      end
      @api = TabixApi.new p
      if @api.save
        flash[:success] = 'API created.'
        redirect_to admin_tabix_apis_path
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
      p = api_params
      begin
        p[:alias] = JSON.parse p[:alias]
      rescue
        flash[:error] = 'Please enter a valid JSON string.'
        return render 'new'
      end
      if @api.update p
        flash[:success] = 'API updated.'
        redirect_to edit_admin_tabix_api_path(@api)
      else
        flash[:error] = @api.errors.full_messages
        render 'edit'
      end
    end
  
    def destroy
      @api.destroy
      redirect_to admin_tabix_apis_path
    end
  
    private
  
    def api_params
      p = params.require(:tabix_api).permit(:url_name, :folder, :column_names, :column_types, :alias)
    end
  
    def set_api
      @api = TabixApi.find params[:id]
    end
  end
  