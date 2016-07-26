/* global SC, $ */
var playerContainer = $('#playerFrame');
var display = {
  playPause = $('.player__button--play');
  playTitle = $('.player__title');
}

SC.oEmbed('https://soundcloud.com/prismatic-radio/the-cohabit-series-teaser', {element: playerContainer[0]})
.then(function (scPlayer) {
  console.log(scPlayer);
  // Grab widget controls
  $('iframe').load(function () {
    // $('#player').fadeIn();
    var widget = SC.Widget(this);
    // Show custom widget buttons, and map the functionality
    mapWidget(widget);
  });
});

function mapWidget (player, w) {
  // Widget events
  w.bind(SC.Widget.Events.PLAY, function () {
    console.log('PLAYING!');
  });
  console.log('Mapping...');
  $('#playerBtn').click(function () { console.log('pressed play'); w.play(); });
}

function Player (player, widget) {
  // Loaded info
  this.title = player.title;
  this.artist = player.author_name;
  this.description = player.description;
  this.links = {
    artist: player.author_url,
    sc: player.provider_url,
    img: player.thumbnail_url
  };

  // Widget Methods
  this.bind = widget.bind; // (eventName, listener)
  this.unbind = widget.unbind; // (eventName)
  this.load = widget.load; // (url, options)
  this.play = widget.play;
  this.pause = widget.pause;
  this.toggle = widget.toggle;
  this.seekTo = widget.seekTo; // (milliseconds)
  this.setVolumeTo = widget.setVolumeTo; // (0-100)
  this.next = widget.next;
  this.prev = widget.prev;
  this.skip = widget.skip;

  // Widget Getters
  this.getVolume = widget.getVolume;
  this.getDuration = widget.getDuration;
  this.getPosition = widget.getPosition;
  this.getSounds = widget.getSounds;
  this.getCurrentSound = widget.getCurrentSound;
  this.getCurrentSoundIndex = widget.getCurrentSoundIndex;
  this.isPaused = widget.isPaused;

  // Widget Events
  this.events = {
    loadProgress: SC.Widget.Events.LOAD_PROGRESS
    playProgress: SC.Widget.Events.PLAY_PROGRESS
    play: SC.Widget.Events.PLAY
    pause: SC.Widget.Events.PAUSE
    finish: SC.Widget.Events.FINISH
    seek: SC.Widget.Events.SEEK
  }
}
Player.prototype.setInfo = function () {
  $('#playerName').text(player.title);
  $('#playerLogo').attr('href', player.author_url);
};
Player.prototype.playPause = function () {};
Player.prototype.setTime = function () {};
