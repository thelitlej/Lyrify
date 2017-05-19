import React, { Component } from 'react';
import Player from './Player';
import './App.css';

class App extends Component {

  render() {
    return (
      <div id="container" className="App">
        <Player />
      </div>
    );
  }
}

export default App;