import React, { Component } from 'react';

export default class LoginInfo extends Component {
  render() {
    return <a className="login-button" href={this.props.spotify.getLoginURL()}>Login to spotify</a>;
  }
}