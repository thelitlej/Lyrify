import Request from './Request';

const apiKey = '3c1970e99ed4889fef6bbeb3bb4a6182';

export default class Musixmatch {

  getLyricsFromId(musixmatchId) {
    return new Promise((resolve, reject) => {
      new Request('https://api.musixmatch.com/ws/1.1/track.lyrics.get')
        .addParam('format', 'jsonp')
        .addParam('track_id', musixmatchId)
        .addParam('apikey', apiKey)
        .isGet()
        .isJsonP()
        .send()
        .then(response => {
          if (response.message.body !== '' && response.message.body.lyrics !== undefined && response.message.body.lyrics.lyrics_body !== '') {
            resolve(response.message.body.lyrics.lyrics_body);
          } else {
            reject('No response');
          }
        })
        .catch(error => reject(error));
    });
  }

  getLyrics(track, artist) {
    return this.getSongId(track, artist);
  }

  getSongId(track, artist) {
    return new Promise((resolve, reject) => {

      new Request('https://api.musixmatch.com/ws/1.1/track.search')
        .addParam('format', 'jsonp')
        .addParam('q_track', track)
        .addParam('q_artist', artist)
        .addParam('quorum_factor', 1)
        .addParam('page_size', 1)
        .addParam('apikey', apiKey)
        .isGet()
        .isJsonP()
        .send()
        .then(response => {
          if (response.message.body !== '') {
            if (response.message.body.track_list.length !== 0) {
              this.getLyricsFromId(response.message.body.track_list[0].track.track_id)
                .then((lyrics) => {
                  resolve(lyrics);
                })
                .catch((error) => {
                  resolve('** No lyrics found **');
                });
            } else {
              resolve('** No lyrics found **');
            }
          } else {
            reject('No response');
          }
        })
        .catch(error => {
          resolve('** No lyrics found **');
        });
    });
  }
}
