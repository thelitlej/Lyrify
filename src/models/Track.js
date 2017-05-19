export default class Track {
	constructor(trackName, artist, album, spotifyId, imageURL, audioPreviewUrl, lyrics=''){
		this.trackName = trackName;
		this.artist = artist;
		this.album = album;
		this.spotifyId = spotifyId;
		this.imageURL = imageURL;
    this.audioPreviewUrl = audioPreviewUrl;
		this.lyrics = lyrics;
	}

  equals(otherTrack) {
    return this.id === otherTrack.id;
  }
}