export default class Track {
	constructor(trackName, artist, album, spotifyId, imageURL, lyrics=''){
		this.trackName = trackName;
		this.artist = artist;
		this.album = album;
		this.spotifyId = spotifyId;
		this.imageURL = imageURL;
		this.lyrics = lyrics;
	}

  equals(otherTrack) {
    return this.id === otherTrack.id;
  }
}