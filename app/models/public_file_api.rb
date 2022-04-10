class PublicFileApi < ApplicationRecord
    validates :url_name, presence: true
    validates :path, presence: true
end
  
