var app;

app = angular.module("nfmusic", ['ngResource']);

app.service('PlayerService', function() {
  var list;
  this.pl = new Player;
  this.pl.init();
  list = [];
  JSONP("https://api.vk.com/method/audio.get?owner_id=" + localStorage.getItem("vk_user_id") + "&access_token=" + localStorage.getItem("vk_access_token") + "&callback", (function(_this) {
    return function(tracks) {
      var so, _i, _len;
      if (tracks.error) {
        alert(tracks.error.error_msg);
        if (tracks.error.error_code === 5) {
          location.replace("https://oauth.vk.com/authorize?client_id=2235991&scope=audio&redirect_uri=" + location.href + "/vkac.html&display=page&v=5.27&response_type=token");
        }
        return;
      }
      tracks = tracks.response;
      for (_i = 0, _len = tracks.length; _i < _len; _i++) {
        so = tracks[_i];
        list.push({
          type: "mp3",
          url: so.url,
          title: so.title,
          artist: so.artist
        });
      }
      _this.pl.loadPlaylist(list.slice(1));
      return _this.pl.play(0);
    };
  })(this));
  window.pla = this.pl;
  return this;
});
