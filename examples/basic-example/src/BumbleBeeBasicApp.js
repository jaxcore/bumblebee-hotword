import React, {Component} from 'react';

import BumbleBee from 'bumblebee-hotword';

const bumblebee = new BumbleBee();

bumblebee.setSensitivity(0.5);

bumblebee.setWorkersPath('/bumblebee-workers');

bumblebee.addHotword('bumblebee', require('bumblebee-hotword/hotwords/bumblebee'));

bumblebee.setHotword('bumblebee');

class BumbleBeeBasicApp extends Component {
	constructor() {
		super();
		
		this.state = {
			words: [],
			started: false
		};
		
		const sound = new Audio('sounds/bumblebee.mp3');
		
		bumblebee.on('hotword', (hotword) => {
			sound.play();
			const {words} = this.state;
			words.push(hotword);
			this.setState({words});
		});
	}
	
	start() {
		this.setState({
			started: true
		});
		
		bumblebee.start();
	}
	
	stop() {
		this.setState({
			started: false,
			words: []
		});
		
		bumblebee.stop();
	}
	
	render() {
		return (
			<div className="App">
				
				<button onClick={e => { this.start() }}>Start</button>
				<button onClick={e => { this.stop() }}>Stop</button>
				
				{ this.renderStarted() }
			
			</div>
		);
	}
	
	renderStarted() {
		if (this.state.started) return (<div>
			<h3>Say "bumblebee":</h3>
			
			<ul>
				{this.state.words.map((word, i) => {
					return (<li key={i}>{word}</li>);
				})}
			</ul>
		</div>);
	}
}

export default BumbleBeeBasicApp;
