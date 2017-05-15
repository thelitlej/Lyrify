import React, { Component } from 'react';
import Spotify from '../api/Spotify';
import './App.css';
import SearchField from './SearchField';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
          <SearchField onSearch={(title) => {console.log('title', title)}}/>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
