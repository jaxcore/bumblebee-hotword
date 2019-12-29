let downsampler;

let isRecording = false;
let audioProcessor;
let audioAnalyser;
let audioContext;
let audioSource;
let audioStream;
let gainNode;

let start = function (engines, volume, downsamplerScript, errorCallback, audioProcessCallback, audioContextCallback) {
	if (!downsampler) {
		navigator.mediaDevices.getUserMedia({audio: true})
		.then(stream => {
			audioContext = new (window.AudioContext || window.webkitAudioContext)();
			audioSource = audioContext.createMediaStreamSource(stream);
			audioStream = stream;
			
			gainNode = audioContext.createGain();
			audioSource.connect(gainNode);
			gainNode.gain.value = volume || 1;
			
			audioProcessor = audioContext.createScriptProcessor(4096, 1, 1);
			audioProcessor.onaudioprocess = function (e) {
				if (!isRecording) {
					return;
				}
				const data = e.inputBuffer.getChannelData(0);
				downsampler.postMessage({command: "process", inputFrame: data});
			};
			
			gainNode.connect(audioProcessor);
			audioProcessor.connect(audioContext.destination);
			
			downsampler = new Worker(downsamplerScript);
			const sampleRate = audioSource.context.sampleRate;
			downsampler.postMessage({command: "init", inputSampleRate: sampleRate});
			downsampler.onmessage = function (e) {
				engines.forEach(function (engine) {
					engine.processFrame(e.data);
				});
				
				if (audioProcessCallback) {
					audioProcessCallback(e.data);
				}
			};
			
			audioAnalyser = audioContext.createAnalyser();
			gainNode.connect(audioAnalyser);
			audioContextCallback(audioAnalyser, gainNode);
		})
		.catch(errorCallback);
	}
	
	isRecording = true;
};

let stop = function () {
	isRecording = false;
	if (audioAnalyser) audioAnalyser.disconnect();
	if (audioProcessor) audioProcessor.disconnect();
	if (gainNode) gainNode.disconnect();
	if (audioStream) audioStream.getTracks()[0].stop();
	if (audioContext) audioContext.close();
	if (downsampler) downsampler.postMessage({command: "reset"});
	downsampler = null;
};

module.exports = {start: start, stop: stop};
