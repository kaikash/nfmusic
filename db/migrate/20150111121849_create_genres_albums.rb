class CreateGenresAlbums < ActiveRecord::Migration
  def change
    create_table :genres_albums, id: false do |t|
    	t.belongs_to :genre, index: true
    	t.belongs_to :album, index: true
    end
  end
end
