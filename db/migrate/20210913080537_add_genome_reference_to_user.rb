class AddGenomeReferenceToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :genome_reference, :string, default: "hg19"
  end
end
