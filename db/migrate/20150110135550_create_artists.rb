class CreateArtists < ActiveRecord::Migration
  def change
    create_table :artists do |t|
    	t.belongs_to :logo, index: true
    	t.string :name
    	t.text :description
    	t.integer :type, default: 0

      t.timestamps
    end
  end
end
