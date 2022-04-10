class User < ApplicationRecord
    has_many :datasets, dependent: :destroy
    has_many :analysis_user_data, dependent: :destroy
    has_many :viz_file_objects, dependent: :destroy
    has_many :tasks, dependent: :destroy
    
    def self.clear_inactive_users
        Rails.logger.info 'start cleaning inactive user data'
        @users = User.where "updated_at < ?", 2.weeks.ago
        cleaned_user = []
        @users.each do |user|
            FileUtils.rm_rf "#{Rails.root}/data/user/#{user.id}" if Dir.exist? "#{Rails.root}/data/user/#{user.id}"
            cleaned_user << user.id
            user.destroy
        end
        Rails.logger.info "inactive user #{cleaned_user} cleared successfully"
    end

    def self.exists(id)
        self.find(id)
        false
      rescue
        true
    end
end
