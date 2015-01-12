class Player
	core: new Audio()
	currentCore: "html5"
	events: []
	SoundCloud: null
	TRACK: { default: true }
	CURRENT_SONG: 0
	__volume: 0.7
	__pvolume: 0.7
	saveVolumeState: true
	savePlaylist: false
	saveCurrentSongPosition: false
	requestTrackInfo: () =>
		@trigger "trackinfo", @TRACK, @
	on: (eventNames, func) =>
		for eventName in eventNames.split(",")
			if @events[eventName] == undefined
				@events[eventName] = []
			@events[eventName].push func
	trigger: (eventName, args, th) =>
		if @events[eventName] != undefined
			for func in @events[eventName]
				if th != undefined
					func.call(th, args)
				else
					func.call(th, args)
	init: =>
		if localStorage.getItem("player_volume") and @saveVolumeState
			@__volume = localStorage.getItem("player_volume") / 1
			setTimeout () =>
				@trigger "volumechange", {}, @
			, 0
		@core = new Audio()
		@currentCore = "html5"
		window.pla = @core
		@core.addEventListener "timeupdate", () =>
			@trigger "timeupdate", {}, @
			@trigger "progress", @core.progress, @
		@core.addEventListener "play", () =>
			@trigger "play", {}, @
		@core.addEventListener "ended", () =>
			@trigger "ended", {}, @
		@core.addEventListener "pause", () =>
			@trigger "pause", {}, @
		@core.addEventListener "progress", () =>
			@trigger "progress", @core.buffered.end(@core.buffered.length-1)/@duration, @
		@SoundCloud = new SoundCloud()
		@SoundCloud.init @, "sciframe"
		@SoundCloud.volume = @__volume
		@on "ended", =>
			do @next
		@on "timeupdate", =>
			if @saveCurrentSongPosition
				localStorage.setItem("player_current_song", 
					JSON.stringify 
						currentTime: @currentTime
						currentSong: @CURRENT_SONG
				)
		if @savePlaylist and localStorage.getItem("player_playlist")
			@loadPlaylist JSON.parse(localStorage.getItem("player_playlist"))
			if @saveCurrentSongPosition and localStorage.getItem("player_current_song")
				curr = localStorage.getItem("player_current_song")
				curr = JSON.parse(curr)
				@play curr.currentSong
				@CURRENT_SONG = curr.currentSong
				do @pause
				@currentTime = curr.currentTime
				@TRACK = @PLAYLIST[@CURRENT_SONG]
				@trigger "trackinfo", @TRACK, @
		@trigger "ready", {}, @

Object.defineProperties Player.prototype, 
		currentTime:
			set: (time) ->
				switch @currentCore
					when "html5"
						try
							@core.currentTime = time
						catch
							console.log "Error"
					when "soundcloud"
						@SoundCloud.widget.seekTo(time*1000)
			get: () ->
				switch @currentCore
					when "html5"
						return @core.currentTime
					when "soundcloud"
						return @SoundCloud.currentTime
				return 0
		timeLeft:
			get: () ->
				switch @currentCore
					when "html5"
						return @core.duration - @core.currentTime
				return 0
		seconds:
			get: () ->
				if @currentTime%60 < 10
					return "0" + Math.floor(@currentTime%60)
				else
					return "" + Math.floor(@currentTime%60)
		duration:
			get: () ->
				switch @currentCore
					when "html5"
						return @core.duration
					when "soundcloud"
						return @SoundCloud.duration
		progress:
			get: () ->
				return @currentTime/@duration
			set: (val) ->
				@currentTime = @duration*val
		minutes:
			get: () ->
				if @currentTime/60 < 10 and @hours > 0
					return "0" + Math.floor(@currentTime/60)
				else
					return "" + Math.floor(@currentTime/60)
		hours:
			get: () ->
				if @currentTime/360 < 10 and Math.floor(@currentTime/360) > 0
					return "0" + Math.floor(@currentTime/360)
				else if Math.floor(@currentTime/360) > 0
					return "" + Math.floor(@currentTime/360)
				else
					return ""
		secondsLeft:
			get: () ->
				if @timeLeft%60 < 10
					return "0" + Math.floor(@timeLeft%60)
				else
					return "" + Math.floor(@timeLeft%60)
		minutesLeft:
			get: () ->
				if @timeLeft/60 < 10 and @hours > 0
					return "0" + Math.floor(@timeLeft/60)
				else
					return "" + Math.floor(@timeLeft/60)
		hoursLeft:
			get: () ->
				if @timeLeft/360 < 10 and Math.floor(@timeLeft/360) > 0
					return "0" + Math.floor(@timeLeft/360)
				else if Math.floor(@timeLeft/360) > 0
					return "" + Math.floor(@timeLeft/360)
				else
					return ""
		
		volume:
			set: (volume) ->
				@SoundCloud.widget.setVolume volume
				@core.volume = volume
				@__volume = volume
				@SoundCloud.volume = @__volume
				if @saveVolumeState then localStorage.setItem "player_volume", @__volume
				@trigger "volumechange", {}, @
			get: () ->
				switch @currentCore
					when "html5"
						return @core.volume
					when "soundcloud"
						return @SoundCloud.volume/100
				return 0
		toggleMute:
			value: () ->
				if @__volume != 0
					@__pvolume = @__volume
					@volume = 0
				else
					@volume = @__pvolume
		paused:
			get: () ->
				switch @currentCore
					when "html5"
						return @core.paused
					when "soundcloud"
						return @SoundCloud.paused
				return 0
			set: (val) ->
				if val == true or val == false 
					if val
						do @pause
						@trigger "pause", {}, this
					else
						do @play
						@trigger "play", {}, this
		play:
			value: (songIndex) ->
				if songIndex != undefined and typeof (songIndex/1) == "number"
					@CURRENT_SONG = songIndex
					@load @PLAYLIST[songIndex]
					return
				if @TRACK.default
					@load @PLAYLIST[0]
				switch @currentCore
					when "html5"
						@core.play()
					when "soundcloud"
						@SoundCloud.widget.play()

		pause:
			value: () ->
				switch @currentCore
					when "html5"
						@core.pause()
					when "soundcloud"
						@SoundCloud.widget.pause()
		stop:
			value: () ->
				@currentTime = 0
				do @pause
				@trigger "stop", {}, this
		toggle:
			value: (reting) ->
				if @paused
					do @play
					return false
				else
					do @pause
					return true
				if reting != undefined
					return this[reting]
		next:
			value: () ->
				if @CURRENT_SONG < @PLAYLIST.length - 1
					@CURRENT_SONG++
					@play @CURRENT_SONG
		prev:
			value: () ->
				if @CURRENT_SONG > 0
					@CURRENT_SONG--
					@play @CURRENT_SONG
		load:
			value: (track) ->
				@TRACK = track
				cvolume = 0
				vint = setInterval () =>
					if cvolume + 0.01 <= @__volume
						cvolume += 0.01


						@SoundCloud.widget.setVolume cvolume
						@core.volume = cvolume
					else
						clearInterval vint
				, 10
				switch track.type
					when "mp3"
						do @stop
						do @SoundCloud.reset
						@currentCore = "html5"
						@core.src = track.url
						@core.autoplay = true
						if !@TRACK.title or !@TRACK.artist
							try
								ID3.loadTags track.url, =>
									setTimeout =>
										tags = ID3.getAllTags(track.url)
										@TRACK.title = tags.title
										@TRACK.artist = tags.artist
										@trigger "trackinfo", @TRACK, @
									, 0
								, ["picture", "artist", "title", "album"]
							catch
								@trigger "trackinfo", @TRACK, @
						else
							@trigger "trackinfo", @TRACK, @
					when "soundcloud"
						do @stop
						@trigger "trackinfo", @TRACK, @

						@currentCore = "soundcloud"
						@SoundCloud.widget.load track.url, { auto_play: true }
		loadPlaylist:
			value: (playlist) ->
				@PLAYLIST = playlist
				@currentTime = 0
				@stop
				@CURRENT_SONG = 0
				@TRACK = @PLAYLIST[@CURRENT_SONG]
				if !@TRACK.title or !@TRACK.artist
					try
						ID3.loadTags @TRACK.url, =>
							setTimeout =>
								tags = ID3.getAllTags(@TRACK.url)
								@TRACK.title = tags.title
								@TRACK.artist = tags.artist
								@trigger "trackinfo", @TRACK, @
							, 0
						, ["picture", "artist", "title", "album"]
					catch
						@trigger "trackinfo", @TRACK, @
				else
					@trigger "trackinfo", @TRACK, @
				if @savePlaylist then localStorage.setItem("player_playlist", JSON.stringify(@PLAYLIST))
		mp3Path:
			set: (url) ->
				if url.substring(url.lastIndexOf("."), url.length) == ".mp3" or url.substring(0, url.lastIndexOf("?")).substring(url.lastIndexOf("."), url.length) == ".mp3"
					@currentCore = "html5"
					@core.src = url
					do @play
