// convert microphone float32 audio data to a pcm16 buffer to stream over websocket
export function pcmBuffer(data) {
	let audio = new DataView(new ArrayBuffer(data.length * 2));
	for (let i = 0; i < data.length; i++) {
		let multiplier = data[i] < 0 ? 0x8000 : 0x7fff;
		let value = (data[i] * multiplier) | 0;
		audio.setInt16(i * 2, value, true);
	}
	return Buffer.from(audio.buffer);
}

// downsample microphone audio data to 16000hz
// https://github.com/mattdiamond/Recorderjs/issues/186#issuecomment-413838080
export function downsampleBuffer(buffer, inputRate, outputRate) {
	let sampleRate = inputRate;
	let rate = outputRate;
	if (rate === sampleRate) {
		return buffer;
	}
	if (rate > sampleRate) {
		throw "downsampling rate show be smaller than original sample rate";
	}
	var sampleRateRatio = sampleRate / rate;
	var newLength = Math.round(buffer.length / sampleRateRatio);
	var result = new Float32Array(newLength);
	var offsetResult = 0;
	var offsetBuffer = 0;
	while (offsetResult < result.length) {
		var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
		// Use average value of skipped samples
		var accum = 0, count = 0;
		for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
			accum += buffer[i];
			count++;
		}
		result[offsetResult] = accum / count;
		// Or you can simply get rid of the skipped samples:
		// result[offsetResult] = buffer[nextOffsetBuffer];
		offsetResult++;
		offsetBuffer = nextOffsetBuffer;
	}
	return result;
}