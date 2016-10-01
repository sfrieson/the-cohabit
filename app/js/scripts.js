/* global SC, $ */
(function () {
  var container, player;
  var stuck = true;
  var playerHeight = null;
  $(function () {
    container = $('#playerContainer');
    player = $('#player');
    checkStatus();
    $(window).scroll(checkStatus)
    $(window).resize(function () { playerHeight = null; })
    var $modal = $('#modal');
    $modal.modal({
      fadeDuration: 2000,
      fadeDelay: 3
    });
  });

  function checkStatus () {
    var top = container[0].getBoundingClientRect().top;
    playerHeight = playerHeight || player[0].getBoundingClientRect().height;
    if (top <= window.innerHeight - playerHeight && stuck) {
      player.removeClass('player--stuck');
      stuck = false;
    } else if (top > window.innerHeight - playerHeight && !stuck) {
      player.addClass('player--stuck');
      stuck = true;
    }
  }
})()

var playerContainer = $('#playerFrame');
var teaserUrl = "http://soundcloud.com/prismatic-radio/the-cohabit-teaser";
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

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  $('.player').show().css({fontSize: '24px', textAlign: 'center'}).html(
    $('<a class="h2 beige-font">').attr('href', teaserUrl).attr('target', '_blank').text('Listen here.')
  );
} else {
  SC.oEmbed(teaserUrl, {element: playerContainer[0]})
  .then(function (scPlayer) {
    // Grab widget controls
    $('iframe').load(function () {
      $('#player').fadeIn();
      var player = new Player(scPlayer, SC.Widget(this));
      // Show custom widget buttons, and map the functionality
      player.mapControls();
      player.startListening();
      player.setText();
    });
  });
}

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
  this.bind = widget.bind.bind(widget); // (eventName, listener)
  this.unbind = widget.unbind.bind(widget); // (eventName)
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
Player.prototype.startListening = function () {
  console.log('startListening');
  var that = this;
  this.bind(Player.events.play, function () { that.setState('playing'); });
  this.bind(Player.events.pause, function () { that.setState('paused'); });
};
Player.prototype.mapControls = function () {
  var that = this;
  display.progress.click(function (e) {
    console.log(e);
    that.scrub(e.offsetX / display.progress.width());
  });
  display.playPause.click(function () { that.playPause(); });
};

Player.prototype.playPause = function () {
  // Toggle play/pause
  this.isPaused(function (isPaused) {
    if (isPaused) {
      this.play();
      this.setState('playing');
      this.bind(Player.events.playProgress, function (data) {
        this.setProgress(data.currentPosition);
        this.setTime(Math.floor(this.duration * data.relativePosition / 1000));
      }.bind(this));
    } else {
      this.pause();
      this.setState('paused');
      this.unbind(Player.events.playProgress);
    }
  }.bind(this));
};

Player.prototype.setProgress = function (position, duration) {
  display.progress.attr('value', position);
  if (duration) display.progress.attr('max', duration);
};

Player.prototype.setText = function () {
  var that = this;
  $('#playerName').text(this.title);
  $('#playerLogo').attr('href', this.links.artist);

  this.getDuration(function (d) {
    that.duration = d;
    that.setTime(Math.floor(d / 1000));
    that.setProgress(0, d);
  });
};

Player.prototype.setState = function (state) {
  if (state === 'playing') {
    display.playPause.addClass('player__btn--playing');
  }
  if (state === 'paused') {
    display.playPause.removeClass('player__btn--playing');
  }
};

Player.prototype.setTime = function (seconds) {
  var minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  if (seconds < 10) seconds = '0' + seconds;
  display.time.min.html(minutes);
  display.time.sec.html(seconds);
};

Player.prototype.scrub = function (percent) {
  var milliseconds = percent * this.duration;
  this.setProgress(milliseconds);
};
