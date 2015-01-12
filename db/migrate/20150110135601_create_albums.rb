class CreateAlbums < ActiveRecord::Migration
  def change
    create_table :albums do |t|
    	t.belongs_to :logo, index: true
    	t.datetime :year
    	t.string :name

      t.timestamps
    end
  end
end
