import React, { Component } from 'react';

export default class Player extends Component {
  componentWillMount() {
    this.state = {id: '5JunxkcjfCYcY7xJ29tLai'};
  }

  play(id) {
    this.setState({id: id});
  }

  render() {
    if (this.state.id === '') {
      return <div></div>;
    } else {
      return (
        <iframe src={'https://open.spotify.com/embed?uri=spotify:track:'+this.state.id}
                frameBorder="0" allowTransparency="true">
        </iframe>
      );
    }
  }
}