class Task < ApplicationRecord
    belongs_to :user, touch: true
    belongs_to :analysis, optional: true
    belongs_to :analysis_pipeline, optional: true
    has_many :task_outputs, dependent: :destroy
end
