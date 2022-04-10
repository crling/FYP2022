class TaskOutput < ApplicationRecord
    belongs_to :task
    belongs_to :analysis
    has_one :analysis_user_datum

    # def self.find_or_store(user_id, output, task_id)
    #     @analysis = 
    #     task_output = TaskOutput.find_by user_id:user_id, ouput_id:output.id, task_id:task_id
    #     if task_output.blank?
    #         file_paths = {}.tap { |x|
    #             output['files'].each do |f|
    #                 data_type = ''
    #                 @analysis.files_info.each do |dataType| 
    #                     if dataType.outputFileName === data_type
    #                         data_type = dataType
    #                     end
    #                 end
    #                 @viz_data_source = VizDataSource.find_by data_type:data_type

    #                 if @viz_data_source.allow_multiple
    #                     paths = x[data_type].blank? [] :x[data_type]
    #                     paths.append({id: 0, 
    #                         url: File.join(demo_folder, fName), 
    #                         is_demo: true})
    #                     x[data_type] = paths
    #                 else
    #                     x[dataType] = {id: 0, 
    #                         url: File.join(demo_folder, fName), 
    #                         is_demo: true}
    #                 end
    #             end
    #         }
    #         task_output = TaskOutput.new(user_id: user_id, task_id:task_id, 
    #                 output_id:output.id, file_paths:file_paths)
    #     end
    #     return task_output

    # end
end
