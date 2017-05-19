import Request from './Request';

const apiKey = 'bf2e7877b219794cc67257048b5f170a';

export default class LastFM {

  getSimilar(track, artist) {
    return new Promise((resolve, reject) => {
      new Request('http://ws.audioscrobbler.com/2.0/')
        .addParam('method', 'track.getsimilar')
        .addParam('artist', artist)
        .addParam('track', track)
        .addParam('limit', 1)
        .addParam('format', 'json')
        .addParam('api_key', apiKey)
        .isGet()
        .send()
        .then(response => {
          resolve([response.similartracks.track[0].name, response.similartracks.track[0].artist.name]);
        });
    });
  }
  
}