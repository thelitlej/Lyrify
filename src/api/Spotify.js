import Request from './Request';
import Track from '../models/Track';

const client_id = '29b4f0a8a0b84623b509def4492ef8d1';


export default class Spotify{
	constructor(){

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
					var track = new Track(
						trackRes.name, 
						trackRes.artists[0].name, 
						trackRes.album.name, 
						trackRes.id,
						trackRes.album.images[0].url,
						trackRes.preview_url
					);
					resolve(track);
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
		})

	}

	addToPlayList(){

	}

}