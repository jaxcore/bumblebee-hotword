const EventEmitter = require('events');
const PorcupineManager = require('./porcupine_manager');
const webVoiceProcessor = require('./web-voice-processor');
const SpectrumAnalyser = require('./spectrum-analyser');

const defaultHotwrds = {
	bumblebee: require('../hotwords/bumblebee'),
	grasshopper: require('../hotwords/grasshopper'),
	hey_edison: require('../hotwords/hey_edison'),
	porcupine: require('../hotwords/porcupine'),
	terminator: require('../hotwords/terminator')
};

class BumbleBee extends EventEmitter {
	constructor() {
		super();
		this.hotword = null;
		this.hotwords = {};
		this.setMicVolume(1);
		this.setMuted(false);
		this.setSensitivity(0.5);
		this.setWorkersPath('/');
		this.setVoiceProcessor(webVoiceProcessor);
		this._detectionCallback = this.detectionCallback.bind(this);
		this._errorCallback = this.errorCallback.bind(this);
		this._audioProcessCallback = this.audioProcessCallback.bind(this);
		this._audioAnalyserCallback = this.audioAnalyserCallback.bind(this);
	}
	
	setVoiceProcessor(proc) {
		this.webVoiceProcessor = proc;
	}
	
	addHotword(name, data, sensitivity) {
		if (!data) {
			if (name in defaultHotwrds) {
				data = defaultHotwrds[name];
			}
		}
		if (data) {
			this.hotwords[name] = {
				data,
				sensitivity: sensitivity || this.defaultSensitivity
			};
		}
		else throw new Error('no hotword data');
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
		if (this.porcupineManager) this.porcupineManager.stop();
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
	
	audioProcessCallback(data, sampleRate) {
		this.emit('data', data, sampleRate);
	}
	
	audioAnalyserCallback(audioAnalyser, gainNode) {
		this.gainNode = gainNode;
		this.emit('analyser', audioAnalyser);
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
		this.porcupineManager.start(keywordIDs, new Float32Array(sensitivities), this._gain, this._detectionCallback, this._errorCallback, this._audioProcessCallback, this._audioAnalyserCallback);
	}
	
	setMuted(muted) {
		this.muted = muted;
		if (this.gainNode) {
			if (muted) {
				this._gain = this.gainNode.gain.value;
				this.gainNode.gain.value = 0;
			}
			else {
				this.gainNode.gain.value = this._gain || 1;
			}
		}
	}
	
	setMicVolume(vol) {
		this._gain = vol;
		if (this.gainNode) this.gainNode.gain.value = vol;
	}
}

module.exports = BumbleBee;
module.exports.SpectrumAnalyser = SpectrumAnalyser;