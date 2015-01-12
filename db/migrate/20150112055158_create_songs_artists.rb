class CreateSongsArtists < ActiveRecord::Migration
  def change
    create_table :songs_artists do |t|
    	t.belongs_to :song, index: true
    	t.belongs_to :artist, index: true
    end
  end
end
