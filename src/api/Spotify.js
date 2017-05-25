import Request from './Request';
import Track from '../models/Track';

const client_id = '29b4f0a8a0b84623b509def4492ef8d1';
const redirect_uri = 'createplaylist-callback.html';


export default class Spotify{

	constructor() {
		this.addToPlayList = this.addToPlayList.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);

		this.playlist = [];
	}

	search(query){
		return new Promise((resolve, reject) => {
			new Request('https://api.spotify.com/v1/search/').isGet()
				.addParam('q', query)
				.addParam('type', 'track')
				.addParam('limit', '1')
				.send()
				.then(response => {
					var trackRes = response.tracks.items[0];
          if (trackRes === undefined) {
            reject('No song found');
          } else {
  					var track = new Track(
  						trackRes.name, 
  						trackRes.artists[0].name, 
  						trackRes.album.name, 
  						trackRes.id,
  						trackRes.uri,
  						trackRes.album.images[0].url,
  						trackRes.preview_url
  					);
  					resolve(track);
          }
				})
				.catch(errorMessage => {
					reject(errorMessage);
				});
		});
	}

	getTrackInfo(id) {
		return new Promise((resolve, reject) => {
			new Request('https://api.spotify.com/v1/tracks/'+id).isGet()
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

  savePlaylist() {
    var spotifyPlaylist = [];
    for (var track of this.playlist) {
      spotifyPlaylist.push(track.spotifyUri);
    }
    localStorage.setItem('createplaylist-tracks', JSON.stringify(spotifyPlaylist));
    localStorage.setItem('createplaylist-name', 'New Playlist');
    this.openLogin();
  }

  openLogin() {
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
    window.open(url, 'asdf', 'WIDTH=400,HEIGHT=500');
  }
}