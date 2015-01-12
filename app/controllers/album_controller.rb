class AlbumController < ApplicationController
	def index
		@albums = Album.All
	end

	def show
		@album = Album.find params[:id]
	end
end
