class RawFilesController < ApplicationController
  # protect_from_forgery :only => [:update, :destroy, :create]
    def index
      path = Base64.decode64(params[:path])
      absPath = File.join Rails.root, 'data', path
      send_file absPath
    end

    def public
      path = Base64.decode64(params[:path])
      absPath = File.join '/data', path
      redirect_to absPath
    end

    def viz_file
      path = File.join Rails.root, 'data', "static_viz_data", full_path 
      send_file path
    end

    def viz_abd_file
      path = File.join Rails.root, "app", "data", "abd_files", full_path 
      send_file path
    end
  

    def demo
      path = File.join Rails.root, 'data/demo', full_path
      send_file path
    end
    
    def uploads
      path = File.join Rails.root, 'data/uploads', full_path
      send_file path
    end

    def outputs
      path = File.join Rails.root, 'data/outputs', full_path
      send_file path
    end
    
    def full_path
      if (params[:format])
        "#{params[:path]}.#{params[:format]}"
      else
        params[:path]
      end
    end

    def database
      path = File.join Rails.root, 'data/public', full_path
      send_file path
    end

  end
  