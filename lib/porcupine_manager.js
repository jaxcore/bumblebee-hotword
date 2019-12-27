const PorcupineManager = (function (webVoiceProcessor, porcupineWorkerScript, downsamplingScript) {
	let porcupineWorker;
	
	let start = function (keywordIDs, sensitivities, volume, detectionCallback, errorCallback, audioProcessCallback, audioContextCallback) {
		porcupineWorker = new Worker(porcupineWorkerScript);
		porcupineWorker.postMessage({
			command: "init",
			keywordIDs: keywordIDs,
			sensitivities: sensitivities
		});
		
		porcupineWorker.onmessage = function (e) {
			detectionCallback(e.data.keyword);
		};
		
		webVoiceProcessor.start([this], volume, downsamplingScript, errorCallback, audioProcessCallback, audioContextCallback);
	};
	
	let stop = function () {
		webVoiceProcessor.stop();
		porcupineWorker.postMessage({command: "release"});
	};
	
	let processFrame = function (frame) {
		porcupineWorker.postMessage({command: "process", inputFrame: frame});
	};
	
	return {start: start, processFrame: processFrame, stop: stop};
});

module.exports = PorcupineManager;