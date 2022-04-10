module Api::ApiHelper

    def render_with_params(str, user, extra_args={})
      str.gsub(/\{(.+?)\}/, user&.genome_reference) 
    end
    
  end
  