import React, {Component} from 'react';
import io from 'socket.io-client';
import wordsToNumbers from 'words-to-numbers';
import Say from 'jaxcore-say';

import BumbleBee, {SpectrumAnalyser} from 'bumblebee-hotword';

const bumblebee = new BumbleBee();
global.bumblebee = bumblebee;

global.wordsToNumbers = wordsToNumbers;

bumblebee.setSensitivity(0.5);
bumblebee.setWorkersPath('./bumblebee-workers');
bumblebee.addHotword('bumblebee', require('bumblebee-hotword/hotwords/bumblebee'));
bumblebee.setHotword('bumblebee');

Say.setWorkers({
	'espeak': 'webworkers/espeak-en-worker.js'
});

var voice = new Say({
	language: 'en',
	profile: 'Jack'
});

class BumbleBeeDeepSpeechApp extends Component {
	constructor() {
		super();
		
		this.state = {
			started: false,
			mode: null,
			recognitionOutput: [],
			unrecognizedText: null,
			muted: false,
			recognitionOn: false,
			menuRemainingTime: 0
		};
		
		this.soundOn = new Audio('sounds/bumblebee-on.mp3');
		this.soundOff = new Audio('sounds/bumblebee-off.mp3');
	}
	
	componentDidMount() {
		this.recognitionCount = 0;
		
		this.socket = io.connect('http://localhost:4000', {});
		this.socket.on('connect', () => {
			console.log('socket connected');
			this.setState({connected: true});
		});
		
		this.socket.on('disconnect', () => {
			console.log('socket disconnected');
			this.setState({connected: false});
			this.stop();
		});
		
		this.socket.on('recognize', (results) => {
			this.processSpeechRecognition(results);
		});
		
		bumblebee.on('hotword', (hotword) => {
			this.setMode('menu');
			
			bumblebee.setMuted(true);
			this.soundOn.onended = function () {
				bumblebee.setMuted(false);
			};
			this.soundOn.play();
			
			if (!this.state.recognitionOn) {
				this.recognitionOn();
			}
			
			console.log('hotword sending reset');
			this.socket.emit('microphone-reset', 'hotword');
		});
		
		
		bumblebee.on('data', (data) => {
			if (this.state.connected && this.state.recognitionOn) {
				this.socket.emit('microphone-data', data.buffer);
			}
		});
		
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
	}
	
	processSpeechRecognition(results) {
		console.log('recognized:', results, this.state.mode);
		const {recognitionOutput} = this.state;
		
		if (this.state.mode === 'menu') {
			
			if (/^(dictation|one|on|pon)$/.test(results.text)) {
				this.setMode('dictation');
			}
			else if (/^(numbers|number|to|two)$/.test(results.text)) {
				this.setMode('numbers');
			}
			else if (/^(parrot|perrot|perrots|three)$/.test(results.text)) {
				this.setMode('parrot');
			}
			else if (/^(quit|exit|for|four)$/.test(results.text)) {
				this.menuQuit();
			}
			else {
				this.setState({
					unrecognizedText: results.text
				});
				this.startMenuTimer();
			}
		}
		else if (this.state.mode === 'dictation') {
			results.id = this.recognitionCount++;
			recognitionOutput.unshift(results);
			this.setState({
				recognitionOutput,
				unrecognizedText: null
			});
		}
		else if (this.state.mode === 'numbers') {
			
			let t = results.text;
			t = t.replace(/^a /, '');
			t = t.split(' ').map((r) => {
				switch (r) {
					case 'for':
						return 'four';
					case 'to':
						return 'two';
					case 'on':
						return 'one';
				}
				return r;
			}).join(' ');
			let numText = wordsToNumbers(t);
			if (numText) {
				if (typeof numText === 'string') {
					console.log('wordsToNumbers', numText);
					numText = numText.replace(/[^0-9. ]/g, "").replace(/ +/g, ' ').trim();
					if (numText) {
						console.log('numText', numText);
						let ns = numText.split(' ');
						for (let i = 0; i < ns.length; i++) {
							let id = this.recognitionCount++;
							recognitionOutput.unshift({
								text: ns[i],
								id
							});
						}
					}
					else {
						this.setState({unrecognizedText: results.text});
						return;
					}
				}
				else {
					console.log('number:', numText);
					results.text = numText;
					results.id = this.recognitionCount++;
					recognitionOutput.unshift(results);
				}
				this.setState({
					recognitionOutput,
					unrecognizedText: null
				});
			}
			else {
				this.setState({unrecognizedText: results.text});
			}
		}
		else if (this.state.mode === 'parrot') {
			results.id = this.recognitionCount++;
			recognitionOutput.unshift(results);
			this.setState({
				recognitionOutput,
				unrecognizedText: null
			});
			
			bumblebee.setMuted(true);
			voice.say(results.text).then(() => {
				bumblebee.setMuted(false);
			});
		}
	}
	
	setMode(mode) {
		clearInterval(this.timeoutInterval);
		this.setState({
			mode,
			recognitionOutput: [],
			unrecognizedText: null
		}, () => {
			if (mode === 'menu') {
				this.startMenuTimer();
			}
		});
	}
	startMenuTimer() {
		clearInterval(this.timeoutInterval);
		this.setState({
			menuStartTime: new Date().getTime(),
			menuRemainingTime: 10000
		});
		this.timeoutInterval = setInterval(() => {
			let menuRemainingTime = 10000 - (new Date().getTime() - this.state.menuStartTime);
			if (menuRemainingTime <= 0) {
				this.menuQuit();
			}
			else {
				this.setState({
					menuRemainingTime
				});
			}
		});
	}
	
	menuQuit() {
		this.setState({
			mode: null,
			unrecognizedText: null
		});
		clearInterval(this.timeoutInterval);
		this.soundOff.play();
		this.recognitionOff();
	}
	
	recognitionOn() {
		this.analyser.setColors('#ffff00', '#222');
		this.setState({
			recognitionOn: true,
			hotwordTime: new Date().getTime()
		});
	}
	
	recognitionOff() {
		this.analyser.setColors('#fff', '#000');
		this.setState({
			recognitionOn: false,
			mode: null
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
			recognitionOutput: [],
			unrecognizedText: null
		});
		this.socket.emit('microphone-reset', 'stop');
		bumblebee.stop();
		if (this.analyser) this.analyser.stop();
	}
	
	render() {
		return (
			<div className="App">
				<button disabled={!this.state.connected || this.state.started} onClick={e => {
					this.start()
				}}>Start
				</button>
				<button disabled={!this.state.connected || !this.state.started} onClick={e => {
					this.stop()
				}}>Stop
				</button>
				<button onClick={e => {
					this.toggleMute()
				}}>{this.state.muted ? 'Unmute' : 'Mute'}</button>
				{' '}
				<strong>Recognition: {this.state.recognitionOn ? 'ON' : 'OFF'}</strong>
				<br/>
				<canvas id="oscilloscope" width="800" height="100" />
				<br/>
				{this.renderMainInfo()}
				{this.renderMenu()}
				{this.renderRecognitionOutput()}
				{this.renderUnrecognized()}
			</div>
		);
	}
	
	renderMenu() {
		if (this.state.mode === 'menu') {
			return (
				<div>
					<div>
						<br/>
						Say one of "dictation", "numbers', "parrot", "quit", or "1", "2", "3", "4": (timeout
						in {Math.ceil(this.state.menuRemainingTime / 1000)})
					</div>
					<ol>
						<li><strong>Dictation</strong></li>
						<li><strong>Numbers</strong></li>
						<li><strong>Parrot</strong></li>
						<li><strong>Quit</strong></li>
					</ol>
				</div>);
		}
	}
	
	renderUnrecognized() {
		if (this.state.unrecognizedText) {
			return (<div>Not recognized: "{this.state.unrecognizedText}"</div>);
		}
	}
	
	renderMainInfo() {
		if (this.state.started) {
			return (<div>
				<span>Say <strong>"bumblebee"</strong> to show the menu.</span>
				<br/>
				{this.renderModeInfo()}
			</div>);
		}
	}
	
	renderModeInfo() {
		if (this.state.mode === 'dictation') {
			return (<div>
				<br/>
				<strong>Dictation Mode: </strong> <span>The results from DeepSpeech will be printed below.</span>
			</div>);
		}
		if (this.state.mode === 'numbers') {
			return (<div>
				<br/>
				<strong>Numbers Mode: </strong> <span>The numbers you speak will be shown below.</span>
			</div>);
		}
		if (this.state.mode === 'parrot') {
			return (<div>
				<br/>
				<strong>Parrot Mode:</strong>
				<span>The words you speak will be spoken back using speech synthesis.</span>
			</div>);
		}
	}
	
	toggleMute() {
		let muted = !bumblebee.muted;
		bumblebee.setMuted(muted);
		this.setState({muted});
		if (this.analyser) this.analyser.setMuted(muted);
	}
	
	renderRecognitionOutput() {
		if (this.state.mode !== 'menu') {
			return (<ul>
				{this.state.recognitionOutput.map((r) => {
					return (<li key={r.id}>{r.text}</li>);
				})}
			</ul>);
		}
	}
}

export default BumbleBeeDeepSpeechApp;
