export default class Track {
	constructor(trackName, artist, album, spotifyId, spotifyUri, imageURL, audioPreviewUrl, lyrics=''){
		this.trackName = trackName;
		this.artist = artist;
		this.album = album;
		this.spotifyId = spotifyId;
    this.spotifyUri = spotifyUri;
		this.imageURL = imageURL;
    this.audioPreviewUrl = audioPreviewUrl;
		this.lyrics = lyrics;
	}

  equals(otherTrack) {
    return this.spotifyId === otherTrack.spotifyId;
  }
}