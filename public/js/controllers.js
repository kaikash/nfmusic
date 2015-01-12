app.controller("playerCtrl", [
  "$scope", "PlayerService", "$rootScope", function($scope, PlayerService, $rootScope) {
    var downArrow, invertMod, leftArrow, rightArrow, scrollAnimateTimeout, seek, seekRelativePosition, seekTimeout, seekVolume, seekingBack, seekingForward, upArrow;
    $scope.artist = PlayerService.pl.TRACK.artist;
    $scope.title = PlayerService.pl.TRACK.title;
    $scope.coverArt = PlayerService.pl.TRACK.coverArt | "";
    $rootScope.player_playlist = PlayerService.pl.PLAYLIST;
    $scope.volume = PlayerService.pl.__volume;
    $scope.position = "0:00";
    $scope.duration = "0:00";
    $scope.udp = true;
    $scope.paused = true;
    $scope.hidden = false;
    $rootScope.currentSong = 0;
    $scope.selectedTrack = 0;
    $scope.keyboardControl = false;
    $scope["default"] = true;
    seekingBack = false;
    seekingForward = false;
    scrollAnimateTimeout = null;
    PlayerService.pl.on("play,pause,ended", function() {
      return $scope.$apply((function(_this) {
        return function() {
          return $scope.paused = _this.paused;
        };
      })(this));
    });
    PlayerService.pl.on("trackinfo", function(trackInfo) {
      console.log("-------------------- TRACK INFO --------------------");
      $scope.coverArt = trackInfo.coverArt;
      $scope.title = trackInfo.title;
      $scope.artist = trackInfo.artist;
      $rootScope.player_playlist = this.PLAYLIST;
      $rootScope.currentSong = this.CURRENT_SONG;
      console.log($scope["default"] = trackInfo["default"]);
      $scope.hidden = false;
      if (!$scope.keyboardControl) {
        $scope.selectedTrack = this.CURRENT_SONG;
      }
      if (scrollAnimateTimeout !== null) {
        clearTimeout(scrollAnimateTimeout);
      }
      return scrollAnimateTimeout = setTimeout(function() {
        return $(".playlist").animate({
          scrollTop: $(".playlist li.play")[0].offsetTop - window.innerHeight / 2
        });
      }, 500);
    });
    PlayerService.pl.on("timeupdate", function() {
      $scope.$apply((function(_this) {
        return function() {
          $rootScope.player_playlist = _this.PLAYLIST;
          $rootScope.currentSong = _this.CURRENT_SONG;
          $scope.position = _this.minutes + ":" + _this.seconds;
          return $scope.duration = Math.round(_this.duration / 60) + ":" + (Math.round(_this.duration % 60) < 10 ? "0" + Math.round(_this.duration % 60) : Math.round(_this.duration % 60));
        };
      })(this));
      if ($scope.udp) {
        $(".seek-bar-container .player-slider-progress").css("width", (this.progress * 100) + "%");
        return $(".seek-bar-container .player-slider-thumb").css("left", (this.progress * 100) + "%");
      }
    });
    PlayerService.pl.on("progress", function(progress) {
      return $(".seek-bar-container .player-slider-buffer").css("width", (progress * 100) + "%");
    });
    PlayerService.pl.on("volumechange", function() {
      $scope.volume = this.volume;
      $(".player-volume-slider .player-slider-progress").css("width", (this.__volume * 100) + "%");
      return $(".player-volume-slider .player-slider-thumb").css("left", (this.__volume * 100) + "%");
    });
    seek = false;
    seekVolume = false;
    seekRelativePosition = 0;
    $(".player .seek-bar-container .player-seek-bar").on("mousedown", function(e) {
      seek = true;
      $scope.udp = false;
      if (seek) {
        if ((e.pageX - $(".player .seek-bar-container .player-seek-bar").offset().left) / $(".player .seek-bar-container .player-seek-bar").width() > 0 && (e.pageX - $(".player .seek-bar-container .player-seek-bar").offset().left) / $(".player .seek-bar-container .player-seek-bar").width() <= 1) {
          seekRelativePosition = (e.pageX - $(".player .seek-bar-container .player-seek-bar").offset().left) / $(".player .seek-bar-container .player-seek-bar").width();
        }
        e.preventDefault();
        $(".seek-bar-container .player-slider-progress").css("width", (seekRelativePosition * 100) + "%");
        return $(".seek-bar-container .player-slider-thumb").css("left", (seekRelativePosition * 100) + "%");
      }
    });
    $(".player-volume-slider").on("mousedown", function(e) {
      var volumeRelativePosition;
      seekVolume = true;
      if ((e.pageX - $(".player-volume-slider").offset().left) / $(".player-volume-slider").width() >= 0 && (e.pageX - $(".player-volume-slider").offset().left) / $(".player-volume-slider").width() <= 1) {
        volumeRelativePosition = (e.pageX - $(".player-volume-slider").offset().left) / $(".player-volume-slider").width();
      }
      PlayerService.pl.volume = volumeRelativePosition;
      return $scope.$apply(function() {
        return $scope.volume = volumeRelativePosition;
      });
    });
    $(window).on("mousemove", function(e) {
      var volumeRelativePosition;
      $scope.keyboardControl = false;
      if (seek) {
        if ((e.pageX - $(".player .seek-bar-container .player-seek-bar").offset().left) / $(".player .seek-bar-container .player-seek-bar").width() > 0 && (e.pageX - $(".player .seek-bar-container .player-seek-bar").offset().left) / $(".player .seek-bar-container .player-seek-bar").width() <= 1) {
          seekRelativePosition = (e.pageX - $(".player .seek-bar-container .player-seek-bar").offset().left) / $(".player .seek-bar-container .player-seek-bar").width();
        }
        e.preventDefault();
        $(".seek-bar-container .player-slider-progress").css("width", (seekRelativePosition * 100) + "%");
        $(".seek-bar-container .player-slider-thumb").css("left", (seekRelativePosition * 100) + "%");
      }
      if (seekVolume) {
        if ((e.pageX - $(".player-volume-slider").offset().left) / $(".player-volume-slider").width() >= 0 && (e.pageX - $(".player-volume-slider").offset().left) / $(".player-volume-slider").width() <= 1) {
          volumeRelativePosition = (e.pageX - $(".player-volume-slider").offset().left) / $(".player-volume-slider").width();
          $scope.$apply(function() {
            return $scope.volume = volumeRelativePosition;
          });
        }
        if (volumeRelativePosition !== void 0) {
          if (volumeRelativePosition > 0.05) {
            if (volumeRelativePosition < 0.95) {
              PlayerService.pl.volume = volumeRelativePosition;
            } else {
              PlayerService.pl.volume = 1;
            }
          } else {
            PlayerService.pl.volume = 0;
          }
        }
        return e.preventDefault();
      }
    }).on("mouseup", function(e) {
      if (seekVolume) {
        seekVolume = false;
      }
      if (seek) {
        seek = false;
        $scope.udp = true;
        if ((e.pageX - $(".player .seek-bar-container .player-seek-bar").offset().left) / $(".player .seek-bar-container .player-seek-bar").width() > 0 && (e.pageX - $(".player .seek-bar-container .player-seek-bar").offset().left) / $(".player .seek-bar-container .player-seek-bar").width() <= 1) {
          seekRelativePosition = (e.pageX - $(".player .seek-bar-container .player-seek-bar").offset().left) / $(".player .seek-bar-container .player-seek-bar").width();
        }
        return PlayerService.pl.progress = seekRelativePosition;
      }
    });
    setInterval(function() {
      if (seekingBack && PlayerService.pl.currentTime > 0) {
        return PlayerService.pl.currentTime -= 0.5;
      } else if (seekingForward && PlayerService.pl.currentTime < PlayerService.pl.duration) {
        return PlayerService.pl.currentTime += 0.5;
      }
    }, 1);
    downArrow = 40;
    upArrow = 38;
    leftArrow = 37;
    rightArrow = 39;
    seekTimeout = null;
    window.addEventListener("keydown", function(e) {
      if (e.keyCode === downArrow) {

      } else if (e.keyCode === upArrow) {

      } else if (e.keyCode === leftArrow && !seekingBack) {
        return seekTimeout = setTimeout(function() {
          seekingBack = true;
          return $scope.pause();
        }, 300);
      } else if (e.keyCode === rightArrow && !seekingForward) {
        return seekTimeout = setTimeout(function() {
          seekingForward = true;
          return $scope.pause();
        }, 300);
      }
    });
    window.addEventListener("keyup", function(e) {
      if (e.keyCode === upArrow) {
        $scope.keyboardControl = true;
        if ($scope.selectedTrack > 0) {
          $scope.selectedTrack -= 1;
        }
      } else if (e.keyCode === downArrow) {
        $scope.keyboardControl = true;
        if ($scope.selectedTrack < $rootScope.player_playlist.length - 1) {
          $scope.selectedTrack += 1;
        }
      } else if (e.keyCode === leftArrow) {
        if (seekTimeout !== null) {
          clearTimeout(seekTimeout);
        }
        if (!seekingBack) {
          $scope.prev();
        }
        seekingBack = false;
        $scope.play();
      } else if (e.keyCode === rightArrow) {
        if (seekTimeout !== null) {
          clearTimeout(seekTimeout);
        }
        if (!seekingForward) {
          $scope.next();
        }
        $scope.play();
      } else if (e.keyCode === 32) {
        $scope.toggle();
      }
      seekingForward = false;
      return seekingBack = false;
    });
    invertMod = new Modal;
    invertMod.type = 'confirm';
    invertMod.title = "Инвертировать колесо мыши";
    invertMod.text = "Инвертировать колесо мыши для управления громкостью?";
    invertMod.init();
    $(".player")[0].addEventListener("mousewheel", function(e) {
      var wheelDelta;
      if (!CONFIG.invertMouseWheel.changed) {
        invertMod.show(function(result) {
          CONFIG.invertMouseWheel.changed = true;
          CONFIG.invertMouseWheel.value = result;
          return CONFIG.update();
        });
      }
      console.log(e.wheelDelta);
      console.log(CONFIG.invertMouseWheel.value);
      wheelDelta = e.wheelDelta;
      if (CONFIG.invertMouseWheel.value) {
        wheelDelta = e.wheelDelta * -1;
      }
      console.log(wheelDelta);
      if (PlayerService.pl.volume + wheelDelta / 100 > 0) {
        if (PlayerService.pl.volume + wheelDelta / 100 < 1) {
          PlayerService.pl.volume += wheelDelta / 100;
        } else {
          PlayerService.pl.volume = 1;
        }
      } else {
        PlayerService.pl.volume = 0;
      }
      return e.preventDefault();
    });
    $scope.toggle = function() {
      return PlayerService.pl.toggle();
    };
    $scope.prev = function() {
      return PlayerService.pl.prev();
    };
    $scope.next = function() {
      return PlayerService.pl.next();
    };
    $rootScope.play = function(songIndex) {
      if (songIndex === $scope.currentSong) {
        return $scope.toggle();
      } else {
        return PlayerService.pl.play(songIndex);
      }
    };
    $scope.pause = function() {
      return PlayerService.pl.pause();
    };
    $scope.stop = function() {
      return PlayerService.pl.stop();
    };
    $scope.mute = function() {
      return PlayerService.pl.toggleMute();
    };
    $scope.loadPlaylist = function(num) {
      var req;
      switch (num) {
        case 1:
          req = new XMLHttpRequest;
          req.open("GET", "tracklist.json", false);
          req.send();
          return PlayerService.pl.loadPlaylist(JSON.parse(req.response));
      }
    };
    return false;
  }
]);

app.controller("PlaylistCtrl", [
  "$scope", "$rootScope", "PlayerService", function($scope, $rootScope, PlayerService) {
    $rootScope.show_playlist = '';
    $rootScope.showPlaylist = function() {
      return $rootScope.show_playlist = 'show-playlist';
    };
    return $rootScope.hidePlaylist = function() {
      return $rootScope.show_playlist = '';
    };
  }
]);
