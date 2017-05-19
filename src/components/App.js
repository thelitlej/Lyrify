import React, { Component } from 'react';
import Player from './Player';
import SearchField from './SearchField';
import Swiper from './Swiper';
import './App.css';

class App extends Component {

  render() {
    return (
      <div id="container" className="App">
        <Player />
    	<Swiper />

      </div>
    );
  }
}

export default App;