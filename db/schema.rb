# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150112055158) do

  create_table "albums", force: true do |t|
    t.integer  "logo_id"
    t.datetime "year"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "albums", ["logo_id"], name: "index_albums_on_logo_id"

  create_table "albums_artists", id: false, force: true do |t|
    t.integer "album_id"
    t.integer "artist_id"
  end

  add_index "albums_artists", ["album_id"], name: "index_albums_artists_on_album_id"
  add_index "albums_artists", ["artist_id"], name: "index_albums_artists_on_artist_id"

  create_table "artists", force: true do |t|
    t.integer  "logo_id"
    t.string   "name"
    t.text     "description"
    t.integer  "type",        default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "artists", ["logo_id"], name: "index_artists_on_logo_id"

  create_table "genres", force: true do |t|
    t.string   "genre"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "genres_albums", id: false, force: true do |t|
    t.integer "genre_id"
    t.integer "album_id"
  end

  add_index "genres_albums", ["album_id"], name: "index_genres_albums_on_album_id"
  add_index "genres_albums", ["genre_id"], name: "index_genres_albums_on_genre_id"

  create_table "genres_artists", id: false, force: true do |t|
    t.integer "genre_id"
    t.integer "artist_id"
  end

  add_index "genres_artists", ["artist_id"], name: "index_genres_artists_on_artist_id"
  add_index "genres_artists", ["genre_id"], name: "index_genres_artists_on_genre_id"

  create_table "genres_songs", id: false, force: true do |t|
    t.integer "genre_id"
    t.integer "song_id"
  end

  add_index "genres_songs", ["genre_id"], name: "index_genres_songs_on_genre_id"
  add_index "genres_songs", ["song_id"], name: "index_genres_songs_on_song_id"

  create_table "logos", force: true do |t|
    t.string   "logo_big"
    t.string   "logo_med"
    t.string   "logo_small"
    t.string   "type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "playlists", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "songs", force: true do |t|
    t.integer  "album_id"
    t.integer  "logo_id"
    t.string   "title"
    t.datetime "year"
    t.integer  "duration"
    t.text     "lyrics"
    t.string   "mp3_url"
    t.string   "ogg_url"
    t.string   "v_url"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "songs", ["album_id"], name: "index_songs_on_album_id"
  add_index "songs", ["logo_id"], name: "index_songs_on_logo_id"

  create_table "songs_artists", force: true do |t|
    t.integer "song_id"
    t.integer "artist_id"
  end

  add_index "songs_artists", ["artist_id"], name: "index_songs_artists_on_artist_id"
  add_index "songs_artists", ["song_id"], name: "index_songs_artists_on_song_id"

end
