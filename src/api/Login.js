var instance = null;


export default class Login {
  constructor() {
    if (!instance) {
      instance = this;
      this.setup();
    }
    return instance;
  }

  setup() {
    this.token = '';
    this.g_username = '';
    this.g_tracks = [];

    this.getUsername = this.getUsername.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
    this.addTracksToPlaylist = this.addTracksToPlaylist.bind(this);
  }

  getUsername(callback) {
    var url = 'https://api.spotify.com/v1/me';

    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.setRequestHeader('Authorization', 'Bearer ' + this.token);
    request.responseType = 'json';
    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE ) {
        if (request.status >= 200 && request.status < 300) {
          callback(request.response.id);
        } else {
          callback(null);
        }
      }
    };
    request.send();
  }

  createPlaylist(username, name, callback) {
    console.log('createPlaylist', username, name);
    var url = 'https://api.spotify.com/v1/users/' + username +
      '/playlists';

    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Authorization', 'Bearer ' + this.token);
    request.setRequestHeader('Content-Type', 'application/json');
    request.responseType = 'json';
    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE ) {
        if (request.status >= 200 && request.status < 300) {
          console.log('create playlist response', request.response);
          callback(request.response.id);
        } else {
          callback(null);
        }
      }
    };
    request.send(JSON.stringify({
      'name': name,
      'public': false
    }));
  }

  addTracksToPlaylist(username, playlist, tracks, callback) {
    console.log('addTracksToPlaylist', username, playlist, tracks);
    var url = 'https://api.spotify.com/v1/users/' + username +
      '/playlists/' + playlist +
      '/tracks'; // ?uris='+encodeURIComponent(tracks.join(','));

    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Authorization', 'Bearer ' + this.token);
    request.setRequestHeader('Content-Type', 'application/json');
    request.responseType = 'text';
    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE ) {
        if (request.status >= 200 && request.status < 300) {
          console.log('add track response', request.response);
          callback(request.response.id);
        } else {
          callback(null);
        }
      }
    };
    request.send(JSON.stringify(tracks));
  }

  validate() {
    // parse hash
    var hash = location.hash.replace(/#/g, '');
    var all = hash.split('&');
    var args = {};

    all.forEach(function(keyvalue) {
      var idx = keyvalue.indexOf('=');
      var key = keyvalue.substring(0, idx);
      var val = keyvalue.substring(idx + 1);
      args[key] = val;
    });


    if (typeof(args['access_token']) !== 'undefined') {
      // got access token
      this.token = args['access_token'];
    }

    // var g_name = localStorage.getItem('createplaylist-name');
    // this.g_tracks = JSON.parse(localStorage.getItem('createplaylist-tracks'));

    /*
    this.getUsername((username) => {
      console.log('got username', username);
      this.createPlaylist(username, g_name, (playlist) => {
        console.log('created playlist', playlist);
        this.addTracksToPlaylist(username, playlist, this.g_tracks, () => {
          console.log('tracks added.');
          document.getElementById('playlistlink').setAttribute('href', 'spotify:user:'+username+':playlist:'+playlist);
          document.getElementById('creating').style.display = 'none';
          document.getElementById('done').style.display = '';
        });
      });
    });
    */
  }
}

/*
var instance = null;


export default Login() {
  constructor() {
    if (instance === null) {
      instance = this;
      this.setup();
    }
    return instance;
  }

  setup() {
    this.g_access_token = '';
    this.g_username = '';
    this.g_tracks = [];
  }

  getUsername(callback) {
    console.log('getUsername');
    var url = 'https://api.spotify.com/v1/me';
    $.ajax(url, {
      dataType: 'json',
      headers: {
        'Authorization': 'Bearer ' + this.g_access_token
      },
      success: function(r) {
        console.log('got username response', r);
        callback(r.id);
      },
      error: function(r) {
        callback(null);
      }
    });
  }

  createPlaylist(username, name, callback) {
    console.log('createPlaylist', username, name);
    var url = 'https://api.spotify.com/v1/users/' + username +
      '/playlists';
    $.ajax(url, {
      method: 'POST',
      data: JSON.stringify({
        'name': name,
        'public': false
      }),
      dataType: 'json',
      headers: {
        'Authorization': 'Bearer ' + this.g_access_token,
        'Content-Type': 'application/json'
      },
      success: function(r) {
        console.log('create playlist response', r);
        callback(r.id);
      },
      error: function(r) {
        callback(null);
      }
    });
  }

  addTracksToPlaylist(username, playlist, tracks, callback) {
    console.log('addTracksToPlaylist', username, playlist, tracks);
    var url = 'https://api.spotify.com/v1/users/' + username +
      '/playlists/' + playlist +
      '/tracks'; // ?uris='+encodeURIComponent(tracks.join(','));
    $.ajax(url, {
      method: 'POST',
      data: JSON.stringify(tracks),
      dataType: 'text',
      headers: {
        'Authorization': 'Bearer ' + this.g_access_token,
        'Content-Type': 'application/json'
      },
      success: function(r) {
        console.log('add track response', r);
        callback(r.id);
      },
      error: function(r) {
        callback(null);
      }
    });
  }

  doit() {
    // parse hash
    var hash = location.hash.replace(/#/g, '');
    var all = hash.split('&');
    var args = {};
    console.log('all', all);
    all.forEach(function(keyvalue) {
      var idx = keyvalue.indexOf('=');
      var key = keyvalue.substring(0, idx);
      var val = keyvalue.substring(idx + 1);
      args[key] = val;
    });

    g_name = localStorage.getItem('createplaylist-name');
    g_tracks = JSON.parse(localStorage.getItem('createplaylist-tracks'));

    console.log('got args', args);

    if (typeof(args['access_token']) != 'undefined') {
      // got access token
      console.log('got access token', args['access_token']);
      this.g_access_token = args['access_token'];
    }

    this.getUsername(function(username) {
      console.log('got username', username);
      createPlaylist(username, g_name, function(playlist) {
        console.log('created playlist', playlist);
        addTracksToPlaylist(username, playlist, g_tracks, function() {
          console.log('tracks added.');
          $('#playlistlink').attr('href', 'spotify:user:'+username+':playlist:'+playlist);
          $('#creating').hide();
          $('#done').show();
        });
      });
    });
  }
}
*/


