import React, { Component } from 'react';

export default class SearchField extends Component {
	constructor(props){
		super(props);
		this.onSubmit = this.onSubmit.bind(this);

		this.state = {searchQuery: ''};
	}

	onSubmit(e) {
		this.props.onSearch(this.state.searchQuery);
		e.preventDefault();
	}

	render() {
		return(
			<form onSubmit={this.onSubmit}>
				<input type="text" onChange={e => this.setState({searchQuery: e.target.value})}>
				</input>
				<input type="submit">
				</input>
			</form>
		)
	}
}