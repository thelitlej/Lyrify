export default class Track {
  constructor(trackName, artist, album, spotifyId, spotifyUri, imageURL, audioPreviewUrl, lyrics=''){
    this.getDominantColor = this.getDominantColor.bind(this);

    this.trackName = trackName;
    this.artist = artist;
    this.album = album;
    this.spotifyId = spotifyId;
    this.spotifyUri = spotifyUri;
    this.imageURL = imageURL;
    this.audioPreviewUrl = audioPreviewUrl;
    this.lyrics = lyrics;
    this.color = '#E53935';

    this.getDominantColor();
  }

  getDominantColor(){

    var img = document.createElement('img');
    img.src = this.imageURL + '?' + new Date().getTime();
    img.setAttribute('crossOrigin', '');

    img.addEventListener('load', () => {
      var vibrant = new window.Vibrant(img);
      this.color = vibrant.VibrantSwatch.getHex();
    });
  }

  equals(otherTrack) {
    return this.spotifyId === otherTrack.spotifyId;
  }
}