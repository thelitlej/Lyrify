import Request from './Request';
import Login from './Login';
import Track from '../models/Track';

const client_id = '29b4f0a8a0b84623b509def4492ef8d1';
const redirect_uri = ''; //'createplaylist-callback.html';


export default class Spotify{

	constructor(token) {
		this.addToPlayList = this.addToPlayList.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);

		this.playlist = [];

    this.token = token? token: '';
	}

	search(query){
		return new Promise((resolve, reject) => {
			new Request('https://api.spotify.com/v1/search/').isGet()
				.addParam('q', query)
				.addParam('type', 'track')
				.addParam('limit', '1')
        .addHeader('Authorization', 'Bearer ' + this.token)
				.send()
				.then(response => {
					var trackRes = response.tracks.items[0];
          if (trackRes === undefined) {
            reject('No song found');
          } else {
            this.getTrackInfo(trackRes.id).then((trackInfo) => {
        			var track = new Track(
        				trackInfo.name, 
        				trackInfo.artists[0].name, 
        				trackInfo.album.name, 
        				trackInfo.id,
        				trackInfo.uri,
        				trackInfo.album.images[0].url,
        				trackInfo.preview_url
        			);
        			resolve(track);
            });
          }
			})
			.catch(errorMessage => {
				reject(errorMessage);
			});
		});
	}

	getTrackInfo(id) {
		return new Promise((resolve, reject) => {
			new Request('https://api.spotify.com/v1/tracks/'+id)
			.isGet()
			.addParam('market', 'SE')
      .addHeader('Authorization', 'Bearer ' + this.token)
			.send()
			.then((response) => {
				resolve(response);
			})
			.catch((errorMessage) => {
				reject(errorMessage);
			});
		});

	}

	addToPlayList(track){
		this.playlist.push(track);
	}

  getUsername() {
  }

  savePlaylist() {
    var login = new Login();
    login.getUsername((username) => {
      login.createPlaylist(username, 'Super duper playlist', (playlist) => {
        console.log('created playlist', playlist);
        var spotifyPlaylist = [];
        for (var track of this.playlist) {
          spotifyPlaylist.push(track.spotifyUri);
        }
        login.addTracksToPlaylist(username, playlist, spotifyPlaylist, () => {
          console.log('success');
        });
      });
    });
  }

  savePlaylistOLD() {
    var spotifyPlaylist = [];
    for (var track of this.playlist) {
      spotifyPlaylist.push(track.spotifyUri);
    }
    localStorage.setItem('createplaylist-tracks', JSON.stringify(spotifyPlaylist));
    localStorage.setItem('createplaylist-name', 'New Playlist');
    this.openLogin();
  }

  getLoginURL() {
    var redirect;
    if (window.location.href.endsWith('/')) {
      redirect = window.location.href.slice(0, -1);
    } else {
      redirect = window.location.href;
    }
    var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
      '&response_type=token' +
      '&scope=playlist-read-private%20playlist-modify%20playlist-modify-private' +
      '&redirect_uri=' + encodeURIComponent(redirect + '/' + redirect_uri);
    return url;
  }

  openLogin() {
    window.open(this.getLoginURL(), 'asdf', 'WIDTH=400,HEIGHT=500');
  }
}

