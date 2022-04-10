class Dataset < ApplicationRecord
  belongs_to :user, touch: true
  has_and_belongs_to_many :samples
  # validates :name, presence: true, uniqueness: { 
  #   message: ->(object, data) do
  #     "Dataset #{data[:value]} already exists. "
  #   end
  # }, on: :create

  def abd_file()
    ids = sample_ids
    return Sample.selected_abd_to_tsv(ids)
  end

  def metadata_file()
    ids = sample_ids
    return Sample.selected_to_csv(ids)
  end

  def add_samples(ids)
    if ids
      @samples = Sample.find(ids)
      @samples.each do |sample|
        unless samples.exists?(sample.id)
          samples << sample
        end
      end
    end
  end

  def delete_samples(ids)
    @samples = Sample.find(ids)
    samples.delete(@samples)
  end

end
