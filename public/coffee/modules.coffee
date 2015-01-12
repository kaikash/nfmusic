app = angular.module "nfmusic", ['ngResource']
app.service 'PlayerService', () ->
	@pl = new Player
	do @pl.init
	# @pl.load { mp3: "song3.mp3" }
	# @pl.currentCore = "soundcloud"
	
	list = []
	JSONP "https://api.vk.com/method/audio.get?owner_id=" + localStorage.getItem("vk_user_id") + "&access_token=" + localStorage.getItem("vk_access_token") + "&callback", (tracks) =>
		if tracks.error
			alert tracks.error.error_msg
			if tracks.error.error_code == 5
				location.replace("https://oauth.vk.com/authorize?client_id=2235991&scope=audio&redirect_uri=" + location.href + "/vkac.html&display=page&v=5.27&response_type=token")
			return
		tracks = tracks.response
		for so in tracks
			list.push
				type: "mp3"
				url: so.url
				title: so.title
				artist: so.artist
		@pl.loadPlaylist list.slice(1)
		@pl.play(0)
		# @pl.stop()
	window.pla = @pl
	return this
	# # @pl.play()

