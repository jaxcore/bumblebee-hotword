import React, {Component} from 'react';

import bumblebee from 'bumblebee-hotword';

class BumbleBeeApp extends Component {
	constructor() {
		super();
		
		this.state = {
			hotwords: ['bumblebee',
				'porcupine',
				'dragonfly',
				'caterpillar',
				'grasshopper',
				'terminator',
				'christina',
				'francesca'],
			bumblebee_started: false,
			spokenHotwords: [],
			selectedHotword: 'bumblebee',
			sensivitiyChanged: false,
			sensitivity: 0.5
		};
		
		this.sound = new Audio('transform.wav');
	}
	
	componentDidMount() {
		bumblebee.setHotword(this.state.selectedHotword);
	}
	
	render() {
		return (
			<div className="App">
				
				Hotword: <select value={this.state.selectedHotword} onChange={e => this.changeHotword(e)}>
					{ this.renderHotwordOptions() }
				</select>
				
				<br/>
				
				Sensitivity: <select value={this.state.sensitivity} onChange={e => this.changeSensitivity(e)}>
					{ this.renderSensitivities() }
				</select>
				
				<br/>
				
				<button onClick={e => this.toggleHotword()}>
					{!this.state.bumblebee_started ? 'Start' : 'Stop'}
				</button>
				
				{this.renderSay()}
				
				{this.renderBumblebees()}
			
			</div>
		);
	}
	
	renderSay() {
		if (!this.state.bumblebee_started) return;
		if (this.state.selectedHotword) return (<h3>Say "{this.state.selectedHotword}":</h3>);
		else return (<h4>Say any of the following: {this.state.hotwords.join(', ')}:</h4>);
	}
	
	renderHotwordOptions() {
		let h = this.state.hotwords.map((hotword,i) => {
			return (<option key={i} value={hotword}>{hotword}</option>);
		});
		h.unshift(<option key={'null'} value={''}>* Any *</option>);
		return h;
	}
	
	renderSensitivities(e) {
		let s = [];
		for (let i=0;i<=10;i++) {
			let n = i / 10; //Math.round(i / 10) / 10:
			let p = i * 10; //Math.round(i / 10) / 10:
			s.push(<option key={i} value={n}>{p}%</option>);
		}
		return s;
	}
	
	changeSensitivity(e) {
		let sensitivity = e.target.options[e.target.selectedIndex].value;
		
		if (this.state.sensivitiyChanged) {
			alert('Sensitivity can only be set before .start(), reload and try again');
		}
		else {
			this.setState({
				sensitivity
			});
			bumblebee.sensitivity(sensitivity);
		}
	}
	
	changeHotword(e) {
		let selectedHotword = e.target.options[e.target.selectedIndex].value;
		bumblebee.setHotword(selectedHotword);
		this.setState({
			selectedHotword,
			spokenHotwords: []
		});
	}
	
	toggleHotword() {
		let hotword = this.state.selectedHotword;
		if (!this.state.bumblebee_started) {
			console.log('starting', hotword);
			
			this.setState({
				bumblebee_started: true,
				spokenHotwords: [],
				sensivitiyChanged: true
			});
			
			bumblebee.start((word) => {
				this.recognizeHotword(word);
			});
		}
		else {
			bumblebee.stop();
			
			this.setState({
				bumblebee_started: false,
				spokenHotwords: []
			});
		}
	}
	
	recognizeHotword(word) {
		if (word === this.state.selectedHotword || !this.state.selectedHotword) {
			this.sound.play();
			
			const spokenHotwords = this.state.spokenHotwords;
			spokenHotwords.push(word);
			
			console.log('recognized hotword', word);
			this.setState({
				spokenHotwords
			});
		}
		else {
			console.log('did not recognize', word);
		}
	}
	
	renderBumblebees() {
		let b = this.state.spokenHotwords.map((word,i) => {
			return (<li key={i}>{word}</li>);
		});
		return (<ul>
			{b}
		</ul>);
	}
	
}

export default BumbleBeeApp;
