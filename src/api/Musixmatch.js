import Request from './Request';

const apiKey = '3c1970e99ed4889fef6bbeb3bb4a6182';

export default class Musixmatch {

  getLyrics(musicbrainzId) {
    return new Promise((resolve, reject) => {
      new Request('https://api.musixmatch.com/ws/1.1/track.lyrics.get')
        .addParam('format', 'json')
        .addParam('callback', 'callback')
        .addParam('track_mbid', musicbrainzId)
        .addParam('apikey', apiKey)
        .isGet()
        .send()
        .then(response => {
          console.log(response);
          resolve(response.lyrics.lyrics_body);
        });
    });
  }
}