class BreadcrumbHelper
  attr_accessor :path

  def initialize
    @path = []
  end

  def add_path(label, url=nil)
    @path << [label, url]
  end
end

module ApplicationHelper
  def bootstrap_alert_class_for_flash(flash_type)
    case flash_type
    when 'success'
      'alert-success'
    when 'error'
      'alert-danger'
    when 'alert'
      'alert-warning'
    when 'notice'
      'alert-info'
    else
      flash_type.to_s
    end
  end

  def bootstrap_class_for_flash(flash_type)
    case flash_type
    when 'success'
      'success'
    when 'error'
      'danger'
    when 'alert'
      'warning'
    when 'notice'
      'info'
    else
      flash_type.to_s
    end
  end

  def in_admin?
    controller.class.name.split('::').first == 'Admin'
  end

  def page_is_dark?
    (controller_name == 'welcome' && action_name == 'index') ||
      (controller_name == 'sessions') ||
      (controller_name == 'registrations') ||
      (controller_name == 'passwords') ||
      (controller_name == 'confirmations') ||
      (controller_name == 'unlocks')
  end

  def current_layout
    controller.send :_layout, ['']
  end

  def breadcrumb(title, options={})
    h = BreadcrumbHelper.new
    yield h
    if current_layout == 'app'
      content_for :breadcrumb do
        render partial: 'partials/app_breadcrumb',
               locals: { title: title, path: h.path, classes: options[:class] || '' }
      end
    else
      render partial: 'partials/breadcrumb',
             locals: { title: title, path: h.path, classes: options[:class] || '' }
    end
  end

  def file_tree(path, ignore_root = true)
    if File.directory? path
      node_data = { li_attr: { node_type: 'folder' },
                    text: File.basename(path),
                    icon: 'fa fa-folder',
                    opened: false,
                    selected: false
                  }

      files = Dir.glob File.join(path, '*')
      if files.any?
        node_data[:children] = []

        files.each do |item|
          node_data[:children].push file_tree(item, false)
        end
      end

      return node_data[:children] if ignore_root
    else
      node_data = { li_attr: { node_type: 'file' }, text: File.basename(path) }

      node_data[:icon] = if path.end_with? '.png', '.jpg', '.jpeg', '.gif'
                           'fa fa-image'
                         elsif path.end_with? '.zip', '.tar', '.gz'
                           'fa fa-file-archive-o'
                         elsif path.end_with? '.doc', '.docx'
                           'fa fa-file-word-o'
                         elsif path.end_with? '.csv', '.tsv', '.xls', '.xlsx'
                           'fa fa-file-excel-o'
                         elsif path.end_with? '.pdf'
                           'fa fa-file-pdf-o'
                         else
                           'fa fa-file-o'
                         end
    end
    node_data
  end

  def encrypt(id, type)
    key_map = {
      User:                     'lGobm7Kv',
      Module:                   '8888ppcW',
      ModuleInstance:           'Im7Nt3TJ',
      Pipeline:                 'I3hCjOo5',
      PipelineNode:             'dDAN4wKz',
      ProjectContainer:         'sdSis23i',
      Project:                  'xi2k0gnZ',
      TaskPipeline:             'RjH3ysFO',
      PipelineNodeRecord:       'W6eRdyxc',
      PipelineNodeParamRecord:  'Tabvul6n',
      TaskModule:               'SH2siuw9',
      ModuleParamRecord:        'AdT81Bca',
      PipelineInput:            'Z5sHnkXc',
      PersonalModuleAnalysisRecord: 'Aba923BD',
      ModuleApp:                'KCAc89Zd',
      PersonalData:             'APHv9sfx'
    }.freeze
    id += 1000 if type == 'TaskModule' && id > 412 # nee to remove when to production
    cipher = OpenSSL::Cipher.new('des-ecb')
    cipher.encrypt
    cipher.key = key_map[type.to_sym]
    encrypted = cipher.update(id.to_s.rjust(8))
    b16 = Radix::Base.new(Radix::BASE::B16)
    b16.encode(encrypted)
  end

  def update_status(task_key)
    FSClient.do('REFRESH', pipeline: task_key)
    status_json = FSClient.do('QUERY', pipeline: task_key)

    return nil if status_json['STATUS'] != 'OK'

    status = JSON.parse(status_json['INFO'])['status']
    status_pair = {
      'pipeline_created': 'wait',
      'creation_failed': 'failed',
      'in_progress': 'running',
      'completed': 'finished',
      'in_progress_&_need_user_intervention': 'failed',
      'not_active': 'failed'
    }
    status_pair[status.to_sym]
  end

  def get_all_pyomics_tasks(root_dir)
    File.open(File.join(root_dir, '.query.sh'), 'w+') do |f|
      f.write("source #{ENV['PYOMICS_VIRTUAL_ENV']}/bin/activate\n")
      f.write("python #{ENV['PYOMICS_PYTHON_PATH']}/pyomics/env/query.py #{root_dir}\n")
      f.write('deactivate')
    end
    `sh #{File.join(root_dir, '.query.sh')}`
    JSON.parse(File.read(File.join(root_dir, '.task_query.json')))
  rescue StandardError => e
    puts e.message
    nil
  end
end
