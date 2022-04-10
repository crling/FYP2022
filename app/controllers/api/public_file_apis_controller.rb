class Api::PublicFileApisController < ApplicationController
    #before_action :set_project
    before_action :set_api

    def show
        file_path = helpers.render_with_params File.join('/data/public', @api.path),
                                                @user
                                                file_api_params
        redirect_to file_path
    end

    private

    def file_api_params
        params.permit!
    end

    def set_api
        @api = PublicFileApi.find_by_url_name params[:url_name]
    end

    #def set_project
     #   return unless (pid = params[:project_id])
#
 #       @project = Project.find pid
  #  end 
end
  