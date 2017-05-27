import React, { Component } from 'react';

class Track extends Component {
  scrollToBottom(item) {
    if (item !== null) {
      item.scrollIntoView(false);
    }
  }

  render() {
    return (
      <li key={this.props.track.spotifyId+'+1'}
          ref={this.scrollToBottom}>
        <img className="album-image"
             src={this.props.track.imageURL} 
             alt="Album cover"/>
        <span className="song-info" style={{backgroundColor: this.props.track.color}}>
          <h3>{this.props.track.trackName}</h3>
          <p>{this.props.track.artist}</p>
        </span>
      </li>
    );
  }
}

export default class Playlist extends Component {
  render() {
    return (
      <ul className={'playlist'+( this.props.hidden ? ' hidden' : '')}>
        {this.props.playlist.map(track => (
          <Track track={track} key={track.spotifyId}/>
        ))}

        <div className="filler"></div>
      </ul>);
  }
}