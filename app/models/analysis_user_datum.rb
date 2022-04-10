class AnalysisUserDatum < ApplicationRecord
    belongs_to :analysis
    belongs_to :user, touch: true
    belongs_to :task_output, optional: true

    def self.findOrInitializeBy (analysis_id, user_id)
        if !AnalysisUserDatum.where("user_id = ? AND analysis_id = ?",
            user_id, analysis_id).blank?
            @analysis_user_datum = AnalysisUserDatum.find_by analysis_id:analysis_id,
                                                             user_id:user_id 
            return @analysis_user_datum
        end
        @analysis = Analysis.find(analysis_id)
        @analysis_user_datum = @analysis.analysis_user_data.new
        default_chosen = {}.tap { |x|
            @analysis.files_info.each do |dataType, info|
                next unless !VizDataSource.find_by(data_type:dataType).optional
                x[dataType] = nil
            end
        } 
        @analysis_user_datum.chosen =  default_chosen
        @analysis_user_datum.user = User.find(user_id)
        @analysis_user_datum.save!
        return @analysis_user_datum
    end
end
