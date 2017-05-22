import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SongView from './SongView';

//import Cards, { Card } from 'react-swipe-card';

//import Swing from 'react-swing';

import { Stack, Card, Direction } from 'swing';

//import SwipeableViews from 'react-swipeable-views';
//import { bindKeyboard } from 'react-swipeable-views-utils';
//import { virtualize } from 'react-swipeable-views-utils';
//const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

const minDragDistance = 70;

export default class Swiper extends Component {

  componentWillMount() {
    this.addCard = this.addCard.bind(this);
    this.keyPress = this.keyPress.bind(this);

    this.stack = Stack({
      allowedDirections: [Direction.LEFT, Direction.RIGHT],
      throwOutDistance: (e1, e2) => {
        return (window.innerWidth+460)/2;
      },
      throwOutConfidence: (xOffset, yOffset, element) => {
        return Math.min(Math.abs(xOffset/minDragDistance), 1);
      }
    });
    

    this.card = null;


    this.state = {currentTrack: this.props.track, lastTrack: null};

    document.addEventListener('keydown', this.keyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPress);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.track.equals(this.state.currentTrack)) {
      this.setState({currentTrack: nextProps.track, lastTrack: this.state.currentTrack});
    }
  }

  keyPress(event) {
    if (event.repeat) return;

    if (event.key === 'ArrowRight') {
      //this.spotify.addToPlayList(this.state.track);
      this.card.throwOut(1, 0);
    } else if (event.key === 'ArrowLeft') {
      this.card.throwOut(-1, 0);
    }
  }

  addCard(song) {
    if (song !== null) {
      this.card = this.stack.createCard(ReactDOM.findDOMNode(song));
      this.card.on('throwoutleft', () => {
        this.props.swipeLeft();
      });
      this.card.on('throwoutright', () => {
        this.props.swipeRight();
      });
    }
  }

  render() {
    return (
      <div>
        <SongView 
          className="z-index-2"
          key={this.state.currentTrack.spotifyId}
          ref={this.addCard}
          track={this.state.currentTrack} 
          toggleMusic={this.props.toggleMusic}
          isPreviewPlaying={this.props.isPreviewPlaying} />
        {this.state.lastTrack !== null && !this.state.lastTrack.equals(this.state.currentTrack) && 
          <SongView 
            className="z-index-3"
            key={this.state.lastTrack.spotifyId}
            track={this.state.lastTrack} 
            toggleMusic={() => {}}
            isPreviewPlaying={false} />
        }
        {this.props.nextTrack !== null && !this.props.nextTrack.equals(this.state.currentTrack) && 
          <SongView 
            className="z-index-1"
            key={this.props.nextTrack.spotifyId}
            track={this.props.nextTrack} 
            toggleMusic={() => {}}
            isPreviewPlaying={false} />
        }
      </div>
    );
  }
}
/*
<Cards>
  {[1, 2, 3].map(n => {
    <Card><h1>n</h1></Card>
  })}
  {this.props.cards.map(track => 
    <Card>
      <SongView 
        track={track} 
        lyrics={this.props.lyrics} 
        toggleMusic={this.props.toggleMusic}
        isPreviewPlaying={this.props.isPreviewPlaying} />
    </Card>
  )}
</Cards>

<SwipeableViews 
    index={this.state.index}
    animateTransitions={false}
    enableMouseEvents={true}
    onChangeIndex={this.onSwipe} >
  <div></div>
  <SongView 
    track={this.props.track} 
    lyrics={this.props.lyrics} 
    toggleMusic={this.props.toggleMusic}
    isPreviewPlaying={this.props.isPreviewPlaying} />
  <div></div>
</SwipeableViews>




              <SwipeableViews 
                              index={this.state.slideIndex}
                              enableMouseEvents={true}
                              onChangeIndex={this.nextSong} >
                <div></div>
                <Swiper 
                  track={this.state.track} 
                  lyrics={this.state.lyrics} 
                  toggleMusic={this.toggleMusic}
                  isPreviewPlaying={this.state.isPlaying} />
                <div></div>
              </SwipeableViews>
*/