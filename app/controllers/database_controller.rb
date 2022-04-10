class DatabaseController < ApplicationController
    $db_data_dir = File.join(Rails.root, "data", "static_viz_data")

    def overview
        table_json = {
            'country': 'pie_GMREPO_country.tsv',  
            'phenotype': 'pie_GMREPO_phenotype.tsv',
            'sex': 'pie_GMREPO_sex.tsv',  
            'BMI': 'pie_HMGDB_bmi_class.tsv',
            'age': 'pie_HMGDB_age_class.tsv'
        };
        @table_data = {};
        table_json.each do |key, path|
            p = File.join($db_data_dir, path)
            if(File.file?(p))
                current_json = {}
                File.readlines(p).each_with_index do |line, i|
                    line = line.gsub(/"/, '' )
                    contents = line.chomp.split("\t")
                    if i == 0
                        current_json['head'] = contents
                    elsif current_json['body']
                        current_json['body'].push(contents)
                    else  
                        current_json['body']= [contents]
                    end
                end
            end
            @table_data[key] = current_json
        end
        gon.push table_data: @table_data       
    end


end
