import React, { Component } from 'react';
import Spotify from '../api/Spotify';
import SearchField from './SearchField';

export default class Player extends Component {
  componentWillMount() {
    this.play = this.play.bind(this);
    this.search = this.search.bind(this);

    this.state = {id: ''};
  }

  play(id) {
    this.setState({id: id});
  }

  search(query) {
    new Spotify().search(query)
      .then(id => this.play(id))
      .catch(errorMessage => console.log('Error: ', errorMessage));
  }

  startPlaying(iframe) {
    document.getElementById('play-button').click();
  }

  render() {
    return (
        <div>
          <SearchField onSearch={this.search}/>
          {this.state.id === ''
            ? <div></div> 
            : <iframe src={'https://open.spotify.com/embed?uri=spotify:track:'+this.state.id}
                      frameBorder="0" allowTransparency="true"
                      ref={this.startPlaying}>
              </iframe>}
        </div>
      );
  }
}