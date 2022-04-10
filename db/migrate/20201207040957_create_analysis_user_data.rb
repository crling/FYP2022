class CreateAnalysisUserData < ActiveRecord::Migration[6.0]
  def change
    create_table :analysis_user_data do |t|
      t.belongs_to :user
      t.belongs_to :analysis
      t.belongs_to :task_output
      t.json :chosen, null:false
      t.boolean :use_demo_file, default:true
    end
  end
end
