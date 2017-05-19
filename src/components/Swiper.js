import React, { Component } from 'react';

export default class Swiper extends Component {
	constructor(props){
		super(props);

		this.state = {playingFullSong: false};
	}

	play(){
		this.setState({playingFullSong: true});
	}

	render(){
		return(
			<div className="swiper">
				<div className="flex-container">
					<div className="albumImage">
						<img src="/album.jpg" />
						
					</div>

					<div className="trackInfo">
						<button onClick={this.play}>▶︎ Play full song</button>
					</div>
				</div>
				{this.state.playingFullSong && 
					<div className="player">
						<iframe src={'https://open.spotify.com/embed?uri=spotify:track:'+this.props.track.spotifyId}
	                      frameBorder="0" allowTransparency="true">
              			</iframe>
					</div>}
				
				<div className="lyrics">
					OMG<br/>
					OMG<br/>
					OMG<br/>
					OMG<br/>
					OMG<br/>
					OMG<br/>
					OMG<br/>
					OMG<br/>
					OMG<br/>
					OMG<br/>
					OMG<br/>
					OMG<br/>
					OMG<br/>
					OMG<br/>
					OMG<br/>
					OMG<br/>
					v
					v
					OMG<br/>
					OMG<br/>
					OMG<br/>
					OMG<br/>
					OMG<br/>
					v
					v
					OMG<br/>
				</div>
			</div>
		)
	}
}