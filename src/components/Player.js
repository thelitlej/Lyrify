import React, { Component } from 'react';
import Musixmatch from '../api/Musixmatch';
import Spotify from '../api/Spotify';
import LastFM from '../api/LastFM';
import SearchField from './SearchField';
import Swiper from './Swiper';
import Info from './Info';

export default class Player extends Component {
  componentWillMount() {
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.toggleMusic = this.toggleMusic.bind(this);
    this.search = this.search.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.nextSong = this.nextSong.bind(this);

    this.state = {track: null, lyrics: '', isPlaying: false};
    this.upcommingTracks = [];
    this.playlist = [];
    this.history = {};
    this.audioPlayer = null;

    this.spotify = new Spotify();

    document.addEventListener('keydown', this.keyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPress);
  }

  keyPress(event) {
    if (event.key === 'ArrowRight') {
      this.spotify.addToPlayList(this.state.track);
      this.nextSong();
    } else if (event.key === 'ArrowLeft') {
      this.nextSong();
    }
  }

  nextSong() {
    if (this.upcommingTracks.length === 0) {
      new LastFM().getSimilar(this.state.track.trackName, this.state.track.artist)
        .then((upcommingTracks) => {
          this.upcommingTracks = upcommingTracks;
          var lastFMtrack = this.upcommingTracks.shift();
          this.spotify.search(lastFMtrack.name)
            .then(track => this.play(track))
            .catch(errorMessage => console.log('Error: ', errorMessage));
        })
        .catch(errorMessage => console.log('Error: ', errorMessage));

    } else {
      var lastFMtrack = this.upcommingTracks.shift();
      this.spotify.search(lastFMtrack.name)
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

  getLyrics(track, artist) {
    new Musixmatch().getLyrics(track, artist)
      .then((lyrics) => {
        this.setState({lyrics: lyrics});
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  }

  play(track) {
    this.history[track.spotifyId] = track;
    this.getLyrics(track.trackName, track.artist);
    this.setState({track: track});

    if (this.audioPlayer === null) {
      this.audioPlayer = new Audio(track.audioPreviewUrl);  
      this.audioPlayer.onended = () => {
        this.setState({isPlaying: false});
      };
    } else {
      this.audioPlayer.src = track.audioPreviewUrl;
    }
    
    this.audioPlayer.play();
    this.setState({isPlaying: true});
  }

  pause() {
    if (this.audioPlayer !== null) {
      this.audioPlayer.pause();
      this.setState({isPlaying: false});
    }
  }

  toggleMusic() {
    if (this.audioPlayer !== null) {
      if (this.audioPlayer.paused) {
        this.audioPlayer.play();
      } else {
        this.audioPlayer.pause();
      }
      this.setState({isPlaying: !this.audioPlayer.paused});
    }
  }

  search(query) {
    this.upcommingTracks = [];
    this.spotify.search(query)
      .then(track => this.play(track))
      .catch(errorMessage => console.log('Error: ', errorMessage));
  }



  render() {
    return (
        <div> 
          <SearchField onSearch={this.search} />  
          <button onClick={this.spotify.savePlaylist}>Save playlist</button>
          {this.state.track !== null ?
            <Swiper track={this.state.track} 
                    lyrics={this.state.lyrics} 
                    toggleMusic={this.toggleMusic}
                    isPreviewPlaying={this.state.isPlaying} /> :
            <Info />}
        </div>
      );
  }
}