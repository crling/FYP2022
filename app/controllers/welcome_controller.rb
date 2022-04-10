require 'zip'

class WelcomeController < ApplicationController
  def index
    @user = User.find(session[:user_id])
    @dataset_list = @user.datasets
  end

  # def tutorial
  # end

  def contact
  end

  def test
    @analysis_user_datum = AnalysisUserDatum.find 180
    @analysis = @analysis_user_datum.analysis
    file_set = []
    files_info = @analysis.files_info
    files_info.each do |dataType, dataInfo| 
      next unless !dataInfo['demoFilePath'].blank?
      if dataInfo['demoFilePath'].class == String
        file_set << dataInfo['demoFilePath']
      else
        dataInfo['demoFilePath'].each do |fPath|
            file_set << fPath
          end
      end
    end

    if file_set.size == 1
        send_file File.join(Rails.root, file_set.values.first)
        return
    end

    compressed_filestream = Zip::OutputStream.write_buffer(::StringIO.new()) do |zos|
        file_set.each do |fpath|
          zos.put_next_entry File.basename(fpath)
          zos.write File.read(File.join(Rails.root, fpath))
        end
    end

    compressed_filestream.rewind
    send_data compressed_filestream.read, filename: "#{@analysis.name}.zip"
      

  end
end
