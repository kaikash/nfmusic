var Player,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Player = (function() {
  function Player() {
    this.init = __bind(this.init, this);
    this.trigger = __bind(this.trigger, this);
    this.on = __bind(this.on, this);
    this.requestTrackInfo = __bind(this.requestTrackInfo, this);
  }

  Player.prototype.core = new Audio();

  Player.prototype.currentCore = "html5";

  Player.prototype.events = [];

  Player.prototype.SoundCloud = null;

  Player.prototype.TRACK = {
    "default": true
  };

  Player.prototype.CURRENT_SONG = 0;

  Player.prototype.__volume = 0.7;

  Player.prototype.__pvolume = 0.7;

  Player.prototype.saveVolumeState = true;

  Player.prototype.savePlaylist = false;

  Player.prototype.saveCurrentSongPosition = false;

  Player.prototype.requestTrackInfo = function() {
    return this.trigger("trackinfo", this.TRACK, this);
  };

  Player.prototype.on = function(eventNames, func) {
    var eventName, _i, _len, _ref, _results;
    _ref = eventNames.split(",");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      eventName = _ref[_i];
      if (this.events[eventName] === void 0) {
        this.events[eventName] = [];
      }
      _results.push(this.events[eventName].push(func));
    }
    return _results;
  };

  Player.prototype.trigger = function(eventName, args, th) {
    var func, _i, _len, _ref, _results;
    if (this.events[eventName] !== void 0) {
      _ref = this.events[eventName];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        func = _ref[_i];
        if (th !== void 0) {
          _results.push(func.call(th, args));
        } else {
          _results.push(func.call(th, args));
        }
      }
      return _results;
    }
  };

  Player.prototype.init = function() {
    var curr;
    if (localStorage.getItem("player_volume") && this.saveVolumeState) {
      this.__volume = localStorage.getItem("player_volume") / 1;
      setTimeout((function(_this) {
        return function() {
          return _this.trigger("volumechange", {}, _this);
        };
      })(this), 0);
    }
    this.core = new Audio();
    this.currentCore = "html5";
    window.pla = this.core;
    this.core.addEventListener("timeupdate", (function(_this) {
      return function() {
        _this.trigger("timeupdate", {}, _this);
        return _this.trigger("progress", _this.core.progress, _this);
      };
    })(this));
    this.core.addEventListener("play", (function(_this) {
      return function() {
        return _this.trigger("play", {}, _this);
      };
    })(this));
    this.core.addEventListener("ended", (function(_this) {
      return function() {
        return _this.trigger("ended", {}, _this);
      };
    })(this));
    this.core.addEventListener("pause", (function(_this) {
      return function() {
        return _this.trigger("pause", {}, _this);
      };
    })(this));
    this.core.addEventListener("progress", (function(_this) {
      return function() {
        return _this.trigger("progress", _this.core.buffered.end(_this.core.buffered.length - 1) / _this.duration, _this);
      };
    })(this));
    this.SoundCloud = new SoundCloud();
    this.SoundCloud.init(this, "sciframe");
    this.SoundCloud.volume = this.__volume;
    this.on("ended", (function(_this) {
      return function() {
        return _this.next();
      };
    })(this));
    this.on("timeupdate", (function(_this) {
      return function() {
        if (_this.saveCurrentSongPosition) {
          return localStorage.setItem("player_current_song", JSON.stringify({
            currentTime: _this.currentTime,
            currentSong: _this.CURRENT_SONG
          }));
        }
      };
    })(this));
    if (this.savePlaylist && localStorage.getItem("player_playlist")) {
      this.loadPlaylist(JSON.parse(localStorage.getItem("player_playlist")));
      if (this.saveCurrentSongPosition && localStorage.getItem("player_current_song")) {
        curr = localStorage.getItem("player_current_song");
        curr = JSON.parse(curr);
        this.play(curr.currentSong);
        this.CURRENT_SONG = curr.currentSong;
        this.pause();
        this.currentTime = curr.currentTime;
        this.TRACK = this.PLAYLIST[this.CURRENT_SONG];
        this.trigger("trackinfo", this.TRACK, this);
      }
    }
    return this.trigger("ready", {}, this);
  };

  return Player;

})();

Object.defineProperties(Player.prototype, {
  currentTime: {
    set: function(time) {
      switch (this.currentCore) {
        case "html5":
          try {
            return this.core.currentTime = time;
          } catch (_error) {
            return console.log("Error");
          }
          break;
        case "soundcloud":
          return this.SoundCloud.widget.seekTo(time * 1000);
      }
    },
    get: function() {
      switch (this.currentCore) {
        case "html5":
          return this.core.currentTime;
        case "soundcloud":
          return this.SoundCloud.currentTime;
      }
      return 0;
    }
  },
  timeLeft: {
    get: function() {
      switch (this.currentCore) {
        case "html5":
          return this.core.duration - this.core.currentTime;
      }
      return 0;
    }
  },
  seconds: {
    get: function() {
      if (this.currentTime % 60 < 10) {
        return "0" + Math.floor(this.currentTime % 60);
      } else {
        return "" + Math.floor(this.currentTime % 60);
      }
    }
  },
  duration: {
    get: function() {
      switch (this.currentCore) {
        case "html5":
          return this.core.duration;
        case "soundcloud":
          return this.SoundCloud.duration;
      }
    }
  },
  progress: {
    get: function() {
      return this.currentTime / this.duration;
    },
    set: function(val) {
      return this.currentTime = this.duration * val;
    }
  },
  minutes: {
    get: function() {
      if (this.currentTime / 60 < 10 && this.hours > 0) {
        return "0" + Math.floor(this.currentTime / 60);
      } else {
        return "" + Math.floor(this.currentTime / 60);
      }
    }
  },
  hours: {
    get: function() {
      if (this.currentTime / 360 < 10 && Math.floor(this.currentTime / 360) > 0) {
        return "0" + Math.floor(this.currentTime / 360);
      } else if (Math.floor(this.currentTime / 360) > 0) {
        return "" + Math.floor(this.currentTime / 360);
      } else {
        return "";
      }
    }
  },
  secondsLeft: {
    get: function() {
      if (this.timeLeft % 60 < 10) {
        return "0" + Math.floor(this.timeLeft % 60);
      } else {
        return "" + Math.floor(this.timeLeft % 60);
      }
    }
  },
  minutesLeft: {
    get: function() {
      if (this.timeLeft / 60 < 10 && this.hours > 0) {
        return "0" + Math.floor(this.timeLeft / 60);
      } else {
        return "" + Math.floor(this.timeLeft / 60);
      }
    }
  },
  hoursLeft: {
    get: function() {
      if (this.timeLeft / 360 < 10 && Math.floor(this.timeLeft / 360) > 0) {
        return "0" + Math.floor(this.timeLeft / 360);
      } else if (Math.floor(this.timeLeft / 360) > 0) {
        return "" + Math.floor(this.timeLeft / 360);
      } else {
        return "";
      }
    }
  },
  volume: {
    set: function(volume) {
      this.SoundCloud.widget.setVolume(volume);
      this.core.volume = volume;
      this.__volume = volume;
      this.SoundCloud.volume = this.__volume;
      if (this.saveVolumeState) {
        localStorage.setItem("player_volume", this.__volume);
      }
      return this.trigger("volumechange", {}, this);
    },
    get: function() {
      switch (this.currentCore) {
        case "html5":
          return this.core.volume;
        case "soundcloud":
          return this.SoundCloud.volume / 100;
      }
      return 0;
    }
  },
  toggleMute: {
    value: function() {
      if (this.__volume !== 0) {
        this.__pvolume = this.__volume;
        return this.volume = 0;
      } else {
        return this.volume = this.__pvolume;
      }
    }
  },
  paused: {
    get: function() {
      switch (this.currentCore) {
        case "html5":
          return this.core.paused;
        case "soundcloud":
          return this.SoundCloud.paused;
      }
      return 0;
    },
    set: function(val) {
      if (val === true || val === false) {
        if (val) {
          this.pause();
          return this.trigger("pause", {}, this);
        } else {
          this.play();
          return this.trigger("play", {}, this);
        }
      }
    }
  },
  play: {
    value: function(songIndex) {
      if (songIndex !== void 0 && typeof (songIndex / 1) === "number") {
        this.CURRENT_SONG = songIndex;
        this.load(this.PLAYLIST[songIndex]);
        return;
      }
      if (this.TRACK["default"]) {
        this.load(this.PLAYLIST[0]);
      }
      switch (this.currentCore) {
        case "html5":
          return this.core.play();
        case "soundcloud":
          return this.SoundCloud.widget.play();
      }
    }
  },
  pause: {
    value: function() {
      switch (this.currentCore) {
        case "html5":
          return this.core.pause();
        case "soundcloud":
          return this.SoundCloud.widget.pause();
      }
    }
  },
  stop: {
    value: function() {
      this.currentTime = 0;
      this.pause();
      return this.trigger("stop", {}, this);
    }
  },
  toggle: {
    value: function(reting) {
      if (this.paused) {
        this.play();
        return false;
      } else {
        this.pause();
        return true;
      }
      if (reting !== void 0) {
        return this[reting];
      }
    }
  },
  next: {
    value: function() {
      if (this.CURRENT_SONG < this.PLAYLIST.length - 1) {
        this.CURRENT_SONG++;
        return this.play(this.CURRENT_SONG);
      }
    }
  },
  prev: {
    value: function() {
      if (this.CURRENT_SONG > 0) {
        this.CURRENT_SONG--;
        return this.play(this.CURRENT_SONG);
      }
    }
  },
  load: {
    value: function(track) {
      var cvolume, vint;
      this.TRACK = track;
      cvolume = 0;
      vint = setInterval((function(_this) {
        return function() {
          if (cvolume + 0.01 <= _this.__volume) {
            cvolume += 0.01;
            _this.SoundCloud.widget.setVolume(cvolume);
            return _this.core.volume = cvolume;
          } else {
            return clearInterval(vint);
          }
        };
      })(this), 10);
      switch (track.type) {
        case "mp3":
          this.stop();
          this.SoundCloud.reset();
          this.currentCore = "html5";
          this.core.src = track.url;
          this.core.autoplay = true;
          if (!this.TRACK.title || !this.TRACK.artist) {
            try {
              return ID3.loadTags(track.url, (function(_this) {
                return function() {
                  return setTimeout(function() {
                    var tags;
                    tags = ID3.getAllTags(track.url);
                    _this.TRACK.title = tags.title;
                    _this.TRACK.artist = tags.artist;
                    return _this.trigger("trackinfo", _this.TRACK, _this);
                  }, 0);
                };
              })(this), ["picture", "artist", "title", "album"]);
            } catch (_error) {
              return this.trigger("trackinfo", this.TRACK, this);
            }
          } else {
            return this.trigger("trackinfo", this.TRACK, this);
          }
          break;
        case "soundcloud":
          this.stop();
          this.trigger("trackinfo", this.TRACK, this);
          this.currentCore = "soundcloud";
          return this.SoundCloud.widget.load(track.url, {
            auto_play: true
          });
      }
    }
  },
  loadPlaylist: {
    value: function(playlist) {
      this.PLAYLIST = playlist;
      this.currentTime = 0;
      this.stop;
      this.CURRENT_SONG = 0;
      this.TRACK = this.PLAYLIST[this.CURRENT_SONG];
      if (!this.TRACK.title || !this.TRACK.artist) {
        try {
          ID3.loadTags(this.TRACK.url, (function(_this) {
            return function() {
              return setTimeout(function() {
                var tags;
                tags = ID3.getAllTags(_this.TRACK.url);
                _this.TRACK.title = tags.title;
                _this.TRACK.artist = tags.artist;
                return _this.trigger("trackinfo", _this.TRACK, _this);
              }, 0);
            };
          })(this), ["picture", "artist", "title", "album"]);
        } catch (_error) {
          this.trigger("trackinfo", this.TRACK, this);
        }
      } else {
        this.trigger("trackinfo", this.TRACK, this);
      }
      if (this.savePlaylist) {
        return localStorage.setItem("player_playlist", JSON.stringify(this.PLAYLIST));
      }
    }
  },
  mp3Path: {
    set: function(url) {
      if (url.substring(url.lastIndexOf("."), url.length) === ".mp3" || url.substring(0, url.lastIndexOf("?")).substring(url.lastIndexOf("."), url.length) === ".mp3") {
        this.currentCore = "html5";
        this.core.src = url;
        return this.play();
      }
    }
  }
});
