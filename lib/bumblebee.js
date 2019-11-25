const EventEmitter = require('events');
const Porcupine = require('./porcupine');
const PicovoiceAudioManager = require('./picovoiceAudioManager');

let hotwords = {
	'bumblebee': require('./hotwords/bumblebee'),
	'porcupine': require('./hotwords/porcupine'),
	'dragonfly': require('./hotwords/dragonfly'),
	'caterpillar': require('./hotwords/caterpillar'),
	'grasshopper': require('./hotwords/grasshopper'),
	'terminator': require('./hotwords/terminator'),
	'christina': require('./hotwords/christina'),
	'francesca': require('./hotwords/francesca')
};

let hotwordNames = Object.keys(hotwords);

class BumbleBee extends EventEmitter {
	constructor(options) {
		super();
		
		this.hotword = null;
		
		this.setSensitivity(0.1);
		
		if (options) {
			if (options.hotword) {
				this.setHotword(options.hotword);
			}
			if (options.sensitivity) {
				this.sensitivity(options.sensitivity);
			}
		}
	}
	
	setHotword(w) {
		if (w === null || w === '') {
			this.hotword = null;
		}
		else if (hotwordNames.indexOf(w) > -1) {
			this.hotword = w;
		}
		else {
			throw new Error('invalid hotword');
		}
	}
	
	sensitivity(s) {
		this.setSensitivity(s);
	}
	
	setSensitivity(s) {
		this.sensitivities = new Float32Array([s, 1, 1, 1, 1, 1]);
	}
	
	stop() {
		this.audioManager.stop();
	}
	
	createPorcupine(callback) {
		if (!this.porcupine) {
			Porcupine.create(Object.values(hotwords), this.sensitivities, (porcupine) => {
				this.porcupine = porcupine;
				callback();
			});
		}
		else callback();
	}
	
	start(callback) {
		this.createPorcupine(() => {
			this.audioManager = new PicovoiceAudioManager();
			
			this.audioManager.start(this.porcupine,  (keywordIndex) => {
				if (keywordIndex>-1) {
					let keyword = hotwordNames[keywordIndex];
					if (this.hotword === null || keyword === this.hotword) {
						this.emit('hotword', keyword);
						if (callback) callback(keyword);
					}
					else {
						console.log('invalid hotword:', keyword);
					}
				}
			}, function (e) {
				console.log('error', e);
			});
		});
	}
}

module.exports = BumbleBee;