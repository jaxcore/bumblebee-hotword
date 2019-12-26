const EventEmitter = require('events');
const PorcupineManager = require('./porcupine_manager');
const webVoiceProcessor = require('./web-voice-processor');

class BumbleBee extends EventEmitter {
	constructor() {
		super();
		this.hotword = null;
		this.hotwords = {};
		this.setSensitivity(0.5);
		this.setWorkersPath('/');
		this.setVoiceProcessor(webVoiceProcessor);
		this._detectionCallback = this.detectionCallback.bind(this);
		this._errorCallback = this.errorCallback.bind(this);
		this._audioProcessCallback = this.audioProcessCallback.bind(this);
	}
	
	setVoiceProcessor(proc) {
		this.webVoiceProcessor = proc;
	}
	
	addHotword(name, data, sensitivity) {
		this.hotwords[name] = {
			data,
			sensitivity: sensitivity || this.defaultSensitivity
		};
	}
	
	setHotword(w) {
		if (w === null || w === '') {
			this.hotword = null;
		}
		else if (Object.keys(this.hotwords).indexOf(w) > -1) {
			this.hotword = w;
		}
		else {
			throw new Error('invalid hotword');
		}
	}
	
	setSensitivity(s) {
		this.defaultSensitivity = s;
	}
	
	stop() {
		this.porcupineManager.stop();
		this.started = false;
	}
	
	setWorkersPath(path) {
		this.webWorkersPath = path;
	}
	
	detectionCallback(keyword) {
		if (keyword) {
			console.log('bumblebee keyword', keyword);
			if (this.hotword === null || keyword === this.hotword) {
				this.emit('hotword', keyword);
			}
			else {
				console.log('wrong hotword:', keyword);
			}
		}
	}
	
	errorCallback(e) {
		this.emit('error', e);
	}
	
	audioProcessCallback(data) {
		this.emit('data', data);
	}
	
	start() {
		if (this.started) return;
		this.started = true;
		this.porcupineManager = PorcupineManager(
			this.webVoiceProcessor,
			this.webWorkersPath+"/porcupine_worker.js",
			this.webWorkersPath+"/downsampling_worker.js");
		
		let keywordIDs = {};
		let sensitivities = [];
		for (let id in this.hotwords) {
			let h = this.hotwords[id];
			keywordIDs[id] = h.data;
			sensitivities.push(h.sensitivity);
		}
		
		this.porcupineManager.start(keywordIDs, new Float32Array(sensitivities), this._detectionCallback, this._errorCallback, this._audioProcessCallback);
	}
}

module.exports = BumbleBee;