import React, { Component } from 'react';
import Musixmatch from '../api/Musixmatch';
import Spotify from '../api/Spotify';
import LastFM from '../api/LastFM';
import Login from '../api/Login';
import SearchField from './SearchField';
import Swiper from './Swiper';
import Info from './Info';
import Playlist from './Playlist';
import LoginInfo from './LoginInfo';


export default class Player extends Component {
  componentWillMount() {
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.toggleMusic = this.toggleMusic.bind(this);
    this.search = this.search.bind(this);
    this.nextSong = this.nextSong.bind(this);
    this.loadNextSong = this.loadNextSong.bind(this);
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.removeFromPlaylist = this.removeFromPlaylist.bind(this);
    this.toggleShowPlaylist = this.toggleShowPlaylist.bind(this);
    this.enableAudioOnMobile = this.enableAudioOnMobile.bind(this);
    this.saveSwiper = this.saveSwiper.bind(this);

    this.state = {track: null, nextTrack: null, lyrics: '', isPlaying: false, showPlaylist: false};
    this.upcommingTracks = [];
    this.playlist = [];
    this.history = {};
    this.audioPlayer = null;

    if (location.hash !== '') {
      var login = new Login();
      login.validate();
      this.spotify = new Spotify(login.token);
    } else {
      this.spotify = new Spotify();
    }


    this.swiper = null;

    this.enableAudioOnMobile();
  }

  /**
   * As mobile phones only allows audio.play() on user interaction
   * this hack listen for the first click and the play an empty audio
   * which later can be used to play and pause on non-user-interaction event
   */
  enableAudioOnMobile() {
    this.mobileAudioPlay = false;

    var enableFunc = () => {
      if (this.audioPlayer === null) {
        this.audioPlayer = new Audio(); 
        this.audioPlayer.onended = () => {
          this.setState({isPlaying: false});
        };
      }
      if (this.mobileAudioPlay === false) {
        this.audioPlayer.addEventListener('error', (e) => {
          console.log('Error:', e);
        });
        this.audioPlayer.play();
        this.mobileAudioPlay = true;
      }
      document.removeEventListener('click', enableFunc);
    };

    document.addEventListener('click', enableFunc);
  }

  nextSong() {
    if (this.state.nextTrack !== null) {
      this.play(this.state.nextTrack);
      this.loadNextSong();
    } else {
      this.setState({track: null});
    }
  }

  loadNextSong() {
    if (this.upcommingTracks.length === 0) {
      new LastFM().getSimilar(this.state.track.trackName, this.state.track.artist)
        .then((upcommingTracks) => {
          if (upcommingTracks.length === 0) {
            console.log('No more songs');

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
        .catch(errorMessage => {
          this.loadNextSong();
          console.log('Error: ', errorMessage);
        });

    }
  }

  getLyrics(track) {
    new Musixmatch().getLyrics(track.trackName, track.artist)
      .then((lyrics) => {
        if (this.state.track === null) {
          // no song
        } else if (this.state.track.equals(track)) {
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
        this.setState({isPlaying: true});
        this.audioPlayer.play();
      } else {
        if (track.audioPreviewUrl !== null) {
          this.audioPlayer.src = track.audioPreviewUrl;
          this.setState({isPlaying: true});
          this.audioPlayer.play();
        } else {
          this.setState({isPlaying: false});
          this.audioPlayer.pause();
        }
      }
  }

  pause() {
    if (this.audioPlayer !== null) {
      this.audioPlayer.pause();
      this.setState({isPlaying: false});
    }
  }

  toggleMusic() {
    if (this.audioPlayer !== null && this.state.track.audioPreviewUrl !== null) {
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

  saveSwiper(swiper) {
    this.swiper = swiper;
  }

  addToPlaylist() {
    if (this.swiper !== null) {
      this.swiper.swipeRight();
    }
  }

  removeFromPlaylist() {
    if (this.swiper !== null) {
      this.swiper.swipeLeft();
    }
  }

  toggleShowPlaylist() {
    this.setState({showPlaylist: !this.state.showPlaylist});
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
                swipeRight={() => {
                  this.spotify.addToPlayList(this.state.track);
                  this.nextSong();
                }}
                swipeLeft={this.nextSong}
                toggleMusic={this.toggleMusic}
                isPreviewPlaying={this.state.isPlaying}
                ref={this.saveSwiper} />


              <div className="action-bar">
                <button className="removeFromPlaylist"
                        onClick={this.removeFromPlaylist}><i className="material-icons">clear</i></button>
                <span className="playlist-buttons">
                  <button className="savePlaylist" onClick={this.spotify.savePlaylist}>Save playlist</button>
                  <button className="showPlaylist" onClick={this.toggleShowPlaylist}>Show playlist</button>
                </span>
                <button className="addToPlaylist"
                        onClick={this.addToPlaylist}><i className="material-icons">playlist_add</i></button>
              </div>
             </div> :
            <div>
              <Info />
              <LoginInfo spotify={this.spotify} />
            </div>}

            <Playlist playlist={this.spotify.playlist} hidden={!this.state.showPlaylist} />            
        </div>
      );
  }
}