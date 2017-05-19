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

    this.state = {id: ''};

    document.addEventListener('keydown', this.keyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPress);
  }

  keyPress(event) {
    if (event.key === 'ArrowRight') {

    } else if (event.key === 'ArrowLeft') {
      
    }
  }

  nextSong() {
    new LastFM().getSimilar('House of the rising sun', 'The Animals')
      .then(([track, artist]) => {
        console.log(track, artist);
        new Spotify().search(track)
          .then(id => this.play(id))
          .catch(errorMessage => console.log('Error: ', errorMessage));
      })
      .catch(errorMessage => console.log('Error: ', errorMessage));
  }

  play(id) {
    this.setState({id: id});
  }

  search(query) {
    new Spotify().search(query)
      .then(track => this.play(track.spotifyId))
      .catch(errorMessage => console.log('Error: ', errorMessage));
  }

  startPlaying(iframe) {
    document.getElementById('play-button').click();
  }

  render() {
    return (
        <div>
          
          {this.state.id === '' ?
              <SearchField onSearch={this.search} /> :
              <iframe src={'https://open.spotify.com/embed?uri=spotify:track:'+this.state.id}
                      frameBorder="0" allowTransparency="true"
                      ref={this.startPlaying}>
              </iframe>}
        </div>
      );
  }
}