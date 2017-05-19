import React, { Component } from 'react';

import Player from './Player';
import './App.css';
import SearchField from './SearchField';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Player />
      </div>
    );
  }
}

export default App;
