class TabixApi < ApplicationRecord
    validates :url_name, presence: true
    validates :folder, presence: true
    validates :column_names, presence: true
    validates :column_types, presence: true

    def alias_json
        JSON.pretty_generate self.alias
    end
end
