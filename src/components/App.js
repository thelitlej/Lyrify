import React, { Component } from 'react';
import Player from './Player';
import SearchField from './SearchField';

class App extends Component {

  render() {
    return (
      <div style={{textAlign:'center'}} className="App">
        <Player />
      </div>
    );
  }
}

export default App;
