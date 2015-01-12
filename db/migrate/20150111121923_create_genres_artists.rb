class CreateGenresArtists < ActiveRecord::Migration
  def change
    create_table :genres_artists, id: false do |t|
    	t.belongs_to :genre, index: true
    	t.belongs_to :artist, index: true
    end
  end
end
