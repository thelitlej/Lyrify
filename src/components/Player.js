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
    this.loadNextSong = this.loadNextSong.bind(this);
    this.enableAudioOnMobile = this.enableAudioOnMobile.bind(this);

    this.state = {track: null, nextTrack: null, lyrics: '', isPlaying: false};
    this.upcommingTracks = [];
    this.playlist = [];
    this.history = {};
    this.audioPlayer = null;

    this.spotify = new Spotify();

    //document.addEventListener('keydown', this.keyPress);
    this.enableAudioOnMobile();

  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPress);
  }

  /**
   * As mobile phones only allows audio.play() on user interaction
   * this hack listen for the first click and the play an empty audio
   * which later can be used to play and pause on non-user-interaction event
   */
  enableAudioOnMobile() {
    this.mobileAudioPlay = false;

    document.addEventListener('click', () => {
      if (this.audioPlayer === null) {
        this.audioPlayer = new Audio(''); 
      }
      if (this.mobileAudioPlay === false) {
        this.audioPlayer.addEventListener('error', (e) => {
          console.log('Error:', e);
        });
        this.audioPlayer.play();
        this.mobileAudioPlay = true;
      }
    });
  }

  keyPress(event) {
    if (event.repeat) return;

    if (event.key === 'ArrowRight') {
      this.setState({swipeIndex: 2});
      this.spotify.addToPlayList(this.state.track);
      this.nextSong();
    } else if (event.key === 'ArrowLeft') {
      this.setState({swipeIndex: 0});
      this.nextSong();
    }
  }

  nextSong() {
    if (this.state.nextTrack !== null) {
      this.play(this.state.nextTrack);
      this.loadNextSong();
    }
    /*
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
    */
  }

  loadNextSong() {
    if (this.upcommingTracks.length === 0) {
      new LastFM().getSimilar(this.state.track.trackName, this.state.track.artist)
        .then((upcommingTracks) => {
          if (upcommingTracks.length === 0) {
            console.log('No more songs');
            this.setState({track: null});

          } else {
            this.upcommingTracks = upcommingTracks;
            var lastFMtrack = this.upcommingTracks.shift();
            this.spotify.search(lastFMtrack.name)
              .then(track => {
                this.setState({nextTrack: track});
                this.getLyrics(track);
              })
              .catch(errorMessage => console.log('Error: ', errorMessage));
          }
        })
        .catch(errorMessage => console.log('Error: ', errorMessage));

    } else {
      var lastFMtrack = this.upcommingTracks.shift();
      this.spotify.search(lastFMtrack.name)
        .then(track => {
          if (this.history[track.spotifyId] === undefined) {
            this.setState({nextTrack: track});
            this.getLyrics(track);
          } else {
            this.loadNextSong();
          }
        })
        .catch(errorMessage => console.log('Error: ', errorMessage));

    }
  }

  getLyrics(track) {
    new Musixmatch().getLyrics(track.trackName, track.artist)
      .then((lyrics) => {
        if (this.state.track.equals(track)) {
          track.lyrics = lyrics;
          this.setState({track: track});
        } else if (this.state.nextTrack.equals(track)) {
          track.lyrics = lyrics;
          this.setState({nextTrack: track});
        }
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  }

  play(track) {
    this.history[track.spotifyId] = track;
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
      .then(track => {
        this.play(track);
        this.getLyrics(track);
        this.loadNextSong();
      })
      .catch(errorMessage => console.log('Error: ', errorMessage));
  }


  render() {
    return (
        <div> 
          <SearchField onSearch={this.search} />  
          
          {this.state.track !== null ?
            <div>
              <Swiper 
                track={this.state.track} 
                nextTrack={this.state.nextTrack} 
                swipeRight={this.nextSong}
                swipeLeft={this.nextSong}
                toggleMusic={this.toggleMusic}
                isPreviewPlaying={this.state.isPlaying} />
              <div className="action-bar">
                <button className="removeFromPlaylist">╳</button>
                <button onClick={this.spotify.savePlaylist} className="savePlaylist">Save playlist</button>
                <button className="addToPlaylist">✓</button>
              </div>
             </div> :
            <Info />}

        </div>
      );
  }
}