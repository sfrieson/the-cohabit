/* global SC, $ */
var playerContainer = $('#playerFrame');
var display = {
  logo: $('#playerLogo'),
  playPause: $('#playerBtn'),
  playTitle: $('#playerName'),
  progress: $('#playerProgress'),
  time: {
    min: $('#min'),
    sec: $('#sec')
  }
};

SC.oEmbed('https://soundcloud.com/prismatic-radio/the-cohabit-series-teaser', {element: playerContainer[0]})
.then(function (scPlayer) {
  console.log(scPlayer);
  // Grab widget controls
  $('iframe').load(function () {
    $('#player').fadeIn();
    var player = new Player(scPlayer, SC.Widget(this));
    // Show custom widget buttons, and map the functionality
    player.mapControls();
    player.setText();
  });
});

function Player (player, widget) {
  // Loaded info
  this.title = player.title.replace('by Prismatic Radio', '');
  this.artist = player.author_name;
  this.description = player.description;
  this.links = {
    artist: player.author_url,
    sc: player.provider_url,
    img: player.thumbnail_url
  };

  // Widget Methods
  this.widget = widget;
  this.bind = widget.bind; // (eventName, listener)
  this.unbind = widget.unbind; // (eventName)
  this.load = widget.load.bind(widget); // (url, options)
  this.play = widget.play.bind(widget);
  this.pause = widget.pause.bind(widget);
  this.toggle = widget.toggle.bind(widget);
  this.seekTo = widget.seekTo.bind(widget); // (milliseconds)
  this.setVolumeTo = widget.setVolume.bind(widget); // (0-100)
  this.next = widget.next.bind(widget);
  this.prev = widget.prev.bind(widget);
  this.skip = widget.skip.bind(widget);

  // Widget Getters
  // They all take callbacks
  this.getVolume = widget.getVolume.bind(widget);
  this.getDuration = widget.getDuration.bind(widget);
  this.getPosition = widget.getPosition.bind(widget);
  this.getSounds = widget.getSounds.bind(widget);
  this.getCurrentSound = widget.getCurrentSound.bind(widget);
  this.getCurrentSoundIndex = widget.getCurrentSoundIndex.bind(widget);
  this.isPaused = widget.isPaused.bind(widget);
}

// Widget Events
Player.events = {
  loadProgress: SC.Widget.Events.LOAD_PROGRESS,
  playProgress: SC.Widget.Events.PLAY_PROGRESS,
  play: SC.Widget.Events.PLAY,
  pause: SC.Widget.Events.PAUSE,
  finish: SC.Widget.Events.FINISH,
  ready: SC.Widget.Events.READY,
  seek: SC.Widget.Events.SEEK
};

Player.prototype.mapControls = function () {
  console.log(display.playPause);
  // Widget events
  this.bind(Player.events.play, function () {
    console.log('PLAYING!');
  });
  var that = this;
  display.playPause.click(function () { console.log('pressed play'); that.playPause(); });
};

Player.prototype.playPause = function () {
  // Toggle play/pause
  console.log('playPause result:', this.toggle());

  // Switch button image
  display.playPause.toggleClass('player__btn--playing');
};

Player.prototype.setText = function () {
  var that = this;
  $('#playerName').text(this.title);
  $('#playerLogo').attr('href', this.links.artist);

  this.getDuration(function (d) {
    console.log(d);
    that.setTime(Math.floor(d/1000));
  });
};

Player.prototype.setTime = function (seconds) {
  var minutes = Math.floor(seconds / 60);
  display.time.min.html(minutes);
  display.time.sec.html(seconds % 60);
};
