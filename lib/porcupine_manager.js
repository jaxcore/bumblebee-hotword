const PorcupineManager = (function (webVoiceProcessor, porcupineWorkerScript, downsamplingScript, bufferSize, microphone) {
	let porcupineWorker;
	
	let start = function (keywordIDs, sensitivities, volume, detectionCallback, errorCallback, audioProcessCallback, audioContextCallback) {
		porcupineWorker = new Worker(porcupineWorkerScript);
		porcupineWorker.postMessage({
			command: "init",
			keywordIDs: keywordIDs,
			sensitivities: sensitivities
		});
		
		porcupineWorker.onmessage = function (e) {
			// debugger;
			detectionCallback(e.data.keyword, e.data.inputFrame, e.data.inputFrameFloat);
		};
		
		webVoiceProcessor.start([this], volume, downsamplingScript, errorCallback, audioProcessCallback, audioContextCallback, bufferSize, microphone);
	};
	
	let stop = function () {
		webVoiceProcessor.stop();
		porcupineWorker.postMessage({command: "release"});
	};
	
	let processFrame = function (inputFrame, inputFrameFloat) {
		porcupineWorker.postMessage({
			command: "process",
			inputFrame,
			inputFrameFloat
		});
	};
	
	return {start: start, processFrame: processFrame, stop: stop};
});

module.exports = PorcupineManager;