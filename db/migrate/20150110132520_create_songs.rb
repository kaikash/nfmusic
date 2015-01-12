class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
    	t.belongs_to :album, index: true
    	t.belongs_to :logo, index: true
    	t.string :title
    	t.datetime :year
    	t.integer :duration
    	t.text :lyrics
    	t.string :mp3_url
    	t.string :ogg_url
    	t.string :v_url

      t.timestamps
    end
  end
end
