class ModuleRequirement < ApplicationRecord
    belongs_to :analysis
    belongs_to :analysis_pipeline
end
