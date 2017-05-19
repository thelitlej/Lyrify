import Request from './Request';

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
					resolve(response.tracks.items[0].id);
				})
				.catch(errorMessage => {
					reject(errorMessage);
				});
		});
	}

	getSongTitle(id) {
		new Request('https://api.spotify.com/v1/tracks/'+id)
			.isGet()
			.send()
			.then((response) => {
				console.log(response.name);
			})
			.catch((errorMessage) => {
				console.log(errorMessage);
			});
	}

	getAlbumName(){

	}

	getAlbumImage(){

	}

	addToPlayList(){

	}

}