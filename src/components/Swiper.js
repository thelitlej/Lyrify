import React, { Component } from 'react';

export default class Swiper extends Component {
	componentWillMount(){
		this.playFullSong = this.playFullSong.bind(this);
		this.togglePreviewSong = this.togglePreviewSong.bind(this);

		this.state = {playingFullSong: false};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({playingFullSong: false});	
	}

	playFullSong(){
		this.setState({playingFullSong: !this.state.playingFullSong});
	}

	togglePreviewSong() {
		this.props.toggleMusic();
	}

	render(){
		return(
			<div className="swiper">
				<div className="flex-container">
					<div className="albumImage" onClick={this.togglePreviewSong}>
						<p className="play-pause">{this.props.isPreviewPlaying ? '▍▍' : '▶'}</p>
						<img style={{animationPlayState: (this.props.isPreviewPlaying ? 'running' : 'paused')}} src={this.props.track.imageURL} alt="Album cover"/>
					</div>

					<div className="trackInfo">
						<h2>{this.props.track.trackName}</h2>
						<h3>by {this.props.track.artist}</h3>
						<h3>Album: {this.props.track.album}</h3>

						<button onClick={this.playFullSong}>▶︎ Play full song</button>
					</div>
				</div>
				
					<div className={"player" + (this.state.playingFullSong ? "" : " hidden")}>
						{this.state.playingFullSong && 
							<iframe src={'https://open.spotify.com/embed?uri=spotify:track:'+this.props.track.spotifyId}
	                      frameBorder="0" allowTransparency="true">
              </iframe>
             }
					</div>
				
				<div className="lyrics">
					{this.props.lyrics.split('\n').map((item, key) => { // \n to br convert
					  return <span key={key}>{item}<br/></span>
					})}
				</div>
			</div>
		);
	}
}