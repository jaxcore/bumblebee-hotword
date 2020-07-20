let downsampler;

let isRecording = false;
let audioProcessor;
let audioAnalyser;
let audioContext;
let audioSource;
let audioStream;
let gainNode;

let start = function (engines, volume, downsamplerScript, errorCallback, audioProcessCallback, audioContextCallback, bufferSize, microphone) {
	if (!downsampler) {
		const constraints = {
			audio: {
				deviceId: microphone ? {exact: microphone} : undefined
			}
		};
		navigator.mediaDevices.getUserMedia(constraints)
		.then(stream => {
			
			downsampler = new Worker(downsamplerScript);
			
			setTimeout(() => {
				
				audioContext = new (window.AudioContext || window.webkitAudioContext)();
				audioSource = audioContext.createMediaStreamSource(stream);
				audioStream = stream;
				
				gainNode = audioContext.createGain();
				audioSource.connect(gainNode);
				gainNode.gain.value = volume || 1;
				
				audioProcessor = audioContext.createScriptProcessor(bufferSize || 8192, 1, 1);
				
				
				audioProcessor.onaudioprocess = function (e) {
					if (!isRecording) {
						return;
					}
					const data = e.inputBuffer.getChannelData(0);
					
					try {
						// sometimes is crashing here, on downsampler
						downsampler.postMessage({command: "process", inputFrame: data});
					}
					catch(e) {
						debugger;
						errorCallback(e);
					}
				};
				
				gainNode.connect(audioProcessor);
				audioProcessor.connect(audioContext.destination);
				
				const sampleRate = audioSource.context.sampleRate;
				downsampler.postMessage({command: "init", inputSampleRate: sampleRate});
				downsampler.onmessage = function (e) {
					
					engines.forEach(function (engine) {
						engine.processFrame(e.data.outputFrame, e.data.outputFrameFloat);
					});
					
					if (audioProcessCallback) {
						audioProcessCallback(e.data.outputFrame);
					}
				};
				
				audioAnalyser = audioContext.createAnalyser();
				gainNode.connect(audioAnalyser);
				audioContextCallback(audioAnalyser, gainNode);
			},1);
		})
		.catch((e) => {
			errorCallback(e);
		});
	}
	
	isRecording = true;
};

let stop = function () {
	isRecording = false;
	if (audioAnalyser) audioAnalyser.disconnect();
	if (audioProcessor) audioProcessor.disconnect();
	if (gainNode) gainNode.disconnect();
	if (audioStream) audioStream.getTracks()[0].stop();
	// if (audioContext) audioContext.close();
	if (downsampler) downsampler.postMessage({command: "reset"});
	downsampler = null;
};

module.exports = {start: start, stop: stop};
