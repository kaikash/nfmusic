app.controller "playerCtrl", ["$scope", "PlayerService", "$rootScope", ($scope, PlayerService, $rootScope) ->
  
  $scope.artist = PlayerService.pl.TRACK.artist
  $scope.title = PlayerService.pl.TRACK.title
  $scope.coverArt = PlayerService.pl.TRACK.coverArt | ""

  $rootScope.player_playlist = PlayerService.pl.PLAYLIST
  
  $scope.volume = PlayerService.pl.__volume

  $scope.position = "0:00"
  $scope.duration = "0:00"
 
  $scope.udp = true
  $scope.paused = true
  $scope.hidden = false
  $rootScope.currentSong = 0
  $scope.selectedTrack = 0
  $scope.keyboardControl = false
  $scope.default = true
  seekingBack = false
  seekingForward = false
 
  scrollAnimateTimeout = null
 
 #Для изменения состояния плеера
  PlayerService.pl.on "play,pause,ended", () ->
    $scope.$apply =>
      $scope.paused = @paused

#Получаем информацию о треке
  PlayerService.pl.on "trackinfo", (trackInfo) ->
    console.log "-------------------- TRACK INFO --------------------"
    $scope.coverArt = trackInfo.coverArt
    $scope.title = trackInfo.title
    $scope.artist = trackInfo.artist
    $rootScope.player_playlist = @PLAYLIST
    $rootScope.currentSong = @CURRENT_SONG
    console.log $scope.default = trackInfo.default
    $scope.hidden = false
    if !$scope.keyboardControl then $scope.selectedTrack = @CURRENT_SONG
    if scrollAnimateTimeout != null then clearTimeout scrollAnimateTimeout
    scrollAnimateTimeout = setTimeout ->
      $(".playlist").animate
        scrollTop: $(".playlist li.play")[0].offsetTop - window.innerHeight / 2
    , 500
  PlayerService.pl.on "timeupdate", () ->
    $scope.$apply =>
      $rootScope.player_playlist = @PLAYLIST
      $rootScope.currentSong = @CURRENT_SONG
      $scope.position = @minutes + ":" + @seconds
      $scope.duration = Math.round(@duration/60) + ":" + (if Math.round(@duration % 60) < 10 then "0" + Math.round(@duration % 60) else Math.round(@duration % 60))
    if $scope.udp
      $(".seek-bar-container .player-slider-progress").css("width", (@progress*100) + "%")
      $(".seek-bar-container .player-slider-thumb").css("left", (@progress*100) + "%")
  PlayerService.pl.on "progress", (progress) ->
    $(".seek-bar-container .player-slider-buffer").css("width", (progress*100) + "%")
  PlayerService.pl.on "volumechange", () ->
    $scope.volume = @volume
    $(".player-volume-slider .player-slider-progress").css("width", (@__volume*100) + "%")
    $(".player-volume-slider .player-slider-thumb").css("left", (@__volume*100) + "%")
  seek = false
  seekVolume = false
  seekRelativePosition = 0
  $(".player .seek-bar-container .player-seek-bar")
  .on "mousedown", (e) ->
    seek = true
    $scope.udp = false
    if seek
      if (e.pageX-$(".player .seek-bar-container .player-seek-bar").offset().left)/$(".player .seek-bar-container .player-seek-bar").width() > 0 and (e.pageX-$(".player .seek-bar-container .player-seek-bar").offset().left)/$(".player .seek-bar-container .player-seek-bar").width() <= 1
        seekRelativePosition = (e.pageX-$(".player .seek-bar-container .player-seek-bar").offset().left)/$(".player .seek-bar-container .player-seek-bar").width()
      e.preventDefault()
      $(".seek-bar-container .player-slider-progress").css("width", (seekRelativePosition*100) + "%")
      $(".seek-bar-container .player-slider-thumb").css("left", (seekRelativePosition*100) + "%")
  $(".player-volume-slider")
  .on "mousedown", (e) ->
    seekVolume = true
    if (e.pageX-$(".player-volume-slider").offset().left)/$(".player-volume-slider").width() >= 0 and (e.pageX-$(".player-volume-slider").offset().left)/$(".player-volume-slider").width() <= 1
      volumeRelativePosition = (e.pageX-$(".player-volume-slider").offset().left)/$(".player-volume-slider").width()
    PlayerService.pl.volume = volumeRelativePosition
    $scope.$apply () ->
      $scope.volume = volumeRelativePosition
  $(window).on "mousemove", (e) ->
    $scope.keyboardControl = false
    if seek
      if (e.pageX-$(".player .seek-bar-container .player-seek-bar").offset().left)/$(".player .seek-bar-container .player-seek-bar").width() > 0 and (e.pageX-$(".player .seek-bar-container .player-seek-bar").offset().left)/$(".player .seek-bar-container .player-seek-bar").width() <= 1
        seekRelativePosition = (e.pageX-$(".player .seek-bar-container .player-seek-bar").offset().left)/$(".player .seek-bar-container .player-seek-bar").width()
      e.preventDefault()
      $(".seek-bar-container .player-slider-progress").css("width", (seekRelativePosition*100) + "%")
      $(".seek-bar-container .player-slider-thumb").css("left", (seekRelativePosition*100) + "%")
    if seekVolume 
      if (e.pageX-$(".player-volume-slider").offset().left)/$(".player-volume-slider").width() >= 0 and (e.pageX-$(".player-volume-slider").offset().left)/$(".player-volume-slider").width() <= 1
        volumeRelativePosition = (e.pageX-$(".player-volume-slider").offset().left)/$(".player-volume-slider").width()
        $scope.$apply () ->
          $scope.volume = volumeRelativePosition
      if volumeRelativePosition != undefined
        if volumeRelativePosition > 0.05 
          if volumeRelativePosition < 0.95
            PlayerService.pl.volume = volumeRelativePosition
          else
            PlayerService.pl.volume = 1
        else PlayerService.pl.volume = 0
      e.preventDefault()
  .on "mouseup", (e) ->
    if seekVolume
      seekVolume = false
    if seek
      seek = false
      $scope.udp = true
      if (e.pageX-$(".player .seek-bar-container .player-seek-bar").offset().left)/$(".player .seek-bar-container .player-seek-bar").width() > 0 and (e.pageX-$(".player .seek-bar-container .player-seek-bar").offset().left)/$(".player .seek-bar-container .player-seek-bar").width() <= 1
        seekRelativePosition = (e.pageX-$(".player .seek-bar-container .player-seek-bar").offset().left)/$(".player .seek-bar-container .player-seek-bar").width()
      PlayerService.pl.progress = seekRelativePosition
  setInterval ->
    if seekingBack and PlayerService.pl.currentTime > 0
      PlayerService.pl.currentTime -= 0.5
    else if seekingForward and PlayerService.pl.currentTime < PlayerService.pl.duration
      PlayerService.pl.currentTime += 0.5
  , 1
  downArrow = 40
  upArrow = 38
  leftArrow = 37
  rightArrow = 39
  seekTimeout = null
  window.addEventListener "keydown", (e) ->
    if e.keyCode == downArrow

    else if e.keyCode == upArrow

    else if e.keyCode == leftArrow and !seekingBack
      seekTimeout = setTimeout ->
        seekingBack = true
        do $scope.pause
      , 300
    else if e.keyCode == rightArrow and !seekingForward
      seekTimeout = setTimeout ->
        seekingForward = true
        do $scope.pause
      , 300
  window.addEventListener "keyup", (e) ->
    if e.keyCode == upArrow
      $scope.keyboardControl = true
      if $scope.selectedTrack > 0 then $scope.selectedTrack -= 1
    else if e.keyCode == downArrow
      $scope.keyboardControl = true
      if $scope.selectedTrack < $rootScope.player_playlist.length-1 
        $scope.selectedTrack += 1
    else if e.keyCode == leftArrow
      if seekTimeout != null
        clearTimeout seekTimeout

      if !seekingBack
        do $scope.prev
      seekingBack = false
      do $scope.play

    else if e.keyCode == rightArrow
      if seekTimeout != null
        clearTimeout seekTimeout
      if !seekingForward
        do $scope.next
      do $scope.play
    else if e.keyCode == 32
      do $scope.toggle
    seekingForward = false
    seekingBack = false

  invertMod = new Modal
  invertMod.type = 'confirm'
  invertMod.title = "Инвертировать колесо мыши"
  invertMod.text = "Инвертировать колесо мыши для управления громкостью?"
  invertMod.init()
  $(".player")[0]
    .addEventListener "mousewheel", (e) ->
      if !CONFIG.invertMouseWheel.changed
        invertMod.show (result) ->
          CONFIG.invertMouseWheel.changed = true
          CONFIG.invertMouseWheel.value = result
          CONFIG.update()
      console.log e.wheelDelta
      console.log CONFIG.invertMouseWheel.value
      wheelDelta = e.wheelDelta
      if CONFIG.invertMouseWheel.value then wheelDelta = e.wheelDelta * -1
      console.log wheelDelta

      if PlayerService.pl.volume + wheelDelta/100 > 0 
        if PlayerService.pl.volume + wheelDelta/100 < 1
          PlayerService.pl.volume += wheelDelta/100
        else
          PlayerService.pl.volume = 1
      else PlayerService.pl.volume = 0
      do e.preventDefault

  $scope.toggle = () ->
    do PlayerService.pl.toggle
  $scope.prev = () ->
    do PlayerService.pl.prev
  $scope.next = () ->
    do PlayerService.pl.next
  $rootScope.play = (songIndex) ->
    if songIndex == $scope.currentSong then do $scope.toggle
    else PlayerService.pl.play songIndex
  $scope.pause = () ->
    do PlayerService.pl.pause
  $scope.stop = () ->
    do PlayerService.pl.stop
  $scope.mute = () ->
    do PlayerService.pl.toggleMute
  $scope.loadPlaylist = (num) ->
    switch num
      when 1
        req = new XMLHttpRequest
        req.open "GET", "tracklist.json", false
        do req.send
        PlayerService.pl.loadPlaylist JSON.parse(req.response)
  return false
]
app.controller "PlaylistCtrl", ["$scope", "$rootScope", "PlayerService", ($scope, $rootScope, PlayerService) ->
  $rootScope.show_playlist = ''
  $rootScope.showPlaylist = () ->
    $rootScope.show_playlist = 'show-playlist'
  $rootScope.hidePlaylist = () ->
    $rootScope.show_playlist = ''

]