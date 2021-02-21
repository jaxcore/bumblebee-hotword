import React, {Component} from 'react';
import Say from 'jaxcore-say';

import BumbleBee, {SpectrumAnalyser} from 'bumblebee-hotword';

const bumblebee = new BumbleBee();

bumblebee.setWorkersPath('./bumblebee-workers');

bumblebee.addHotword('alexa');
bumblebee.addHotword('bumblebee');
bumblebee.addHotword('computer');
bumblebee.addHotword('grasshopper');
bumblebee.addHotword('hey_edison');
bumblebee.addHotword('hey_google');
bumblebee.addHotword('hey_siri');
bumblebee.addHotword('jarvis');
bumblebee.addHotword('porcupine');
bumblebee.addHotword('terminator');

// bumblebee.setHotword('bumblebee');

Say.setWorkers({
	'espeak': 'webworkers/espeak-en-worker.js'
});

var voice = new Say({
	language: 'en',
	profile: 'Jack'
});

class BumbleBeeApp extends Component {
	constructor() {
		super();
		
		this.state = {
			hotwords: Object.keys(bumblebee.hotwords),
			bumblebee_started: false,
			spokenHotwords: [],
			selectedHotword: null,
			sensivitiyChanged: false,
			sensitivity: 0.5,
			action: 'sounds',
			muted: false,
			microphones: [],
			microphone: 'default'
		};
		
		this.sounds = {
			alexa: new Audio('sounds/alexa.mp3'),
			bumblebee: new Audio('sounds/bumblebee-on.mp3'),
			computer: new Audio('sounds/computer.mp3'),
			grasshopper: new Audio('sounds/grasshopper.mp3'),
			hey_edison: new Audio('sounds/hey_edison.mp3'),
			hey_google: new Audio('sounds/hey_google.mp3'),
			hey_siri: new Audio('sounds/hey_siri.mp3'),
			jarvis: new Audio('sounds/jarvis.mp3'),
			porcupine: new Audio('sounds/porcupine.mp3'),
			terminator: new Audio('sounds/terminator.mp3')
		};
		
		bumblebee.on('hotword', (word) => {
			this.recognizeHotword(word);
		});
		
		bumblebee.on('data', (intData, floatData, sampleRate, hotword) => {
			if (hotword) {
				console.log('data', intData, floatData, sampleRate, hotword);
			}
		});
	}
	
	componentDidMount() {
		bumblebee.setHotword(this.state.selectedHotword);
		
		bumblebee.on('analyser', (analyser) => {
			console.log('analyser', analyser);
			var canvas = document.getElementById('oscilloscope');
			this.analyser = new SpectrumAnalyser(analyser, canvas);
			if (this.state.muted) {
				bumblebee.setMuted(true);
				this.analyser.setMuted(true);
			}
			this.analyser.start();
		});
		
		bumblebee.getMicrophones().then(mics => {
			this.setState({
				microphones: mics
			})
		}).catch(console);
	}
	
	render() {
		return (
			<div className="App">
				Microphone: <select value={this.state.microphone} onChange={e => this.changeMicrophone(e)}>
					{ this.renderMicrophones() }
				</select>
				
				<br/>
				
				Hotword: <select value={this.state.selectedHotword||''} onChange={e => this.changeHotword(e)}>
					{ this.renderHotwordOptions() }
				</select>
				
				<br/>
				
				Sensitivity: <select value={this.state.sensitivity||''} onChange={e => this.changeSensitivity(e)}>
					{ this.renderSensitivities() }
				</select>
				
				<br/>
				
				Action: <select value={this.state.action||''} onChange={e => this.changeAction(e)}>
					<option value="sounds">Sounds</option>
					<option value="texttospeech">Speech To Text</option>
				</select>
				
				<br/>
				
				<button onClick={e => this.toggleHotword()}>
					{this.state.bumblebee_started ? 'Stop' : 'Start'}
				</button>
				
				<button onClick={e => this.toggleMuted()}>
					{this.state.muted ? 'Unmute' : 'Mute'}
				</button>
				
				<br/>
				<canvas id="oscilloscope" width="800" height="100" />
				
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
	
	renderMicrophones() {
		let h = this.state.microphones.map((mic,i) => {
			return (<option key={i} value={mic.id}>{mic.name}</option>);
		});
		return h;
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
			let n = i / 10;
			let p = i * 10;
			s.push(<option key={i} value={n}>{p}%</option>);
		}
		return s;
	}
	
	changeAction(e) {
		let action = e.target.options[e.target.selectedIndex].value;
		this.setState({
			action
		});
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
			bumblebee.setSensitivity(sensitivity);
		}
	}
	
	changeMicrophone(e) {
		let microphone = e.target.options[e.target.selectedIndex].value;
		this.stop();
		this.setState({
			microphone
		}, () => {
			bumblebee.setMicrophone(microphone);
			this.start();
		});
	}
	
	changeHotword(e) {
		// todo: move to server
		let selectedHotword = e.target.options[e.target.selectedIndex].value;
		bumblebee.setHotword(selectedHotword);
		this.setState({
			selectedHotword,
			spokenHotwords: []
		});
	}
	
	toggleHotword() {
		if (!this.state.bumblebee_started) {
			this.start();
		}
		else {
			this.stop();
		}
	}
	
	start() {
		let hotword = this.state.selectedHotword;
		console.log('starting', hotword);
		
		this.setState({
			bumblebee_started: true,
			spokenHotwords: [],
			sensivitiyChanged: true
		});
		
		bumblebee.start();
	}
	stop() {
		bumblebee.stop();
		this.setState({
			bumblebee_started: false,
			spokenHotwords: []
		});
	}
	
	toggleMuted() {
		const muted = !this.state.muted;
		this.setState({
			muted
		}, () => {
			bumblebee.setMuted(muted);
			if (this.analyser) this.analyser.setMuted(muted);
		});
	}
	
	recognizeHotword(hotword) {
		if (hotword === this.state.selectedHotword || !this.state.selectedHotword) {
			
			if (this.state.action === 'sounds') {
				if (this.sounds[hotword]) this.sounds[hotword].play();
			}
			else if (this.state.action === 'texttospeech') {
				voice.say(hotword + 'detected');
			}
			
			const spokenHotwords = this.state.spokenHotwords;
			spokenHotwords.push(hotword);
			
			console.log('recognized hotword', hotword);
			this.setState({
				spokenHotwords
			});
		}
		else {
			console.log('did not recognize', hotword);
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
