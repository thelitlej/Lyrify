import React, { Component } from 'react';
import Spotify from '../api/Spotify';
import LastFM from '../api/LastFM';
import SearchField from './SearchField';

export default class Player extends Component {
  componentWillMount() {
    this.play = this.play.bind(this);
    this.search = this.search.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.nextSong = this.nextSong.bind(this);
    this.startPlaying = this.startPlaying.bind(this);
    this.autoplay = this.autoplay.bind(this);
    this.setAudioPlayer = this.setAudioPlayer.bind(this);
    

    this.state = {track: null};
    this.tracks = [];
    this.history = {};
    this.playButtonIntervalId = null;
    this.audioPlayer = null;

    document.addEventListener('keydown', this.keyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPress);
  }

  keyPress(event) {
    if (event.key === 'ArrowRight') {
      this.nextSong();
    } else if (event.key === 'ArrowLeft') {
      this.nextSong();
    }
  }

  nextSong() {
    console.log(this.tracks.length);
    if (this.tracks.length === 0) {
      new LastFM().getSimilar(this.state.track.trackName, this.state.track.artist)
        .then((tracks) => {
          this.tracks = tracks;
          new Spotify().search(this.tracks.shift().name)
            .then(track => this.play(track))
            .catch(errorMessage => console.log('Error: ', errorMessage));
        })
        .catch(errorMessage => console.log('Error: ', errorMessage));
    } else {
      var lastFMtrack = this.tracks.shift();
      new Spotify().search(lastFMtrack.name)
        .then(track => {
          if (this.history[track.spotifyId] === undefined) {
            this.play(track);
          } else {
            this.nextSong();
          }
        })
        .catch(errorMessage => console.log('Error: ', errorMessage));
    }
  }

  play(track) {
    this.history[track.spotifyId] = track;
    this.setState({track: track});
  }

  search(query) {
    new Spotify().search(query)
      .then(track => this.play(track))
      .catch(errorMessage => console.log('Error: ', errorMessage));
  }

  setAudioPlayer(player) {
    this.audioPlayer = player;
  }

  startPlaying(iframe) {
    let playButton = iframe.target.contentWindow.document.getElementById('play-button');
    if (playButton !== null) {
      playButton.click();
    }
  }

  startPlaying2() {
    let playButton = document.getElementById('play-button');
    if (playButton !== null) {
      playButton.click();
      clearInterval(this.playButtonIntervalId);
    }
  }

  autoplay() {
    this.playButtonIntervalId = setInterval(this.startPlaying2, 500);
  }

  render() {
    if (this.audioPlayer !== null) {
      if (this.state.track.audioPreviewUrl === null) {
        this.nextSong();
      } else {
        this.audioPlayer.src = this.state.track.audioPreviewUrl;
        this.audioPlayer.play();
      }
    }
    return (
        <div>   
          {this.state.track === null ?
              <SearchField onSearch={this.search} /> :
              /*<iframe src={'https://open.spotify.com/embed?uri=spotify:track:'+this.state.track.spotifyId}
                      frameBorder="0" allowTransparency="true"
                      width="288"
                      onLoad={this.startPlaying}>
              </iframe>*/
              <audio controls autoPlay ref={this.setAudioPlayer}>
                <source src={this.state.track.audioPreviewUrl} type="audio/mpeg"/>
                Your browser does not support the audio element.
              </audio>}
        </div>
      );
  }
}