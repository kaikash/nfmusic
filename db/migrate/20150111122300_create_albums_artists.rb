class CreateAlbumsArtists < ActiveRecord::Migration
  def change
    create_table :albums_artists, id: false do |t|
    	t.belongs_to :album, index: true
    	t.belongs_to :artist, index: true
    end
  end
end
