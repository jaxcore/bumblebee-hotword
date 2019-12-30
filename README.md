# BumbleBee Hotword

![screenshot](https://raw.githubusercontent.com/jaxcore/bumblebee-hotword/master/logo.png)

This is a stripped down and repackaged version of the excellent [Porcupine](https://github.com/Picovoice/Porcupine) wake word (hotword) system. This requires no cloud services and is freely available to use under the Apache 2.0 license (GPLv3 compatible).

When BumbleBee is added to a web page, it listens to the microphone and calls a function when it hears the available hotwords.

## Examples

Basic Example: [https://jaxcore.github.io/bumblebee-hotword/basic-example/](https://jaxcore.github.io/bumblebee-hotword/basic-example/)

Full Example: [https://jaxcore.github.io/bumblebee-hotword/full-example/](https://jaxcore.github.io/bumblebee-hotword/full-example/)

#### DeepSpeech Example:

Bumblebee can be used as a hotword/keyword system for [Mozilla DeepSpeech](https://github.com/dsteinman/DeepSpeech) speech recognition engine.  See the [Jaxcore DeepSpeech Plugin](https://github.com/jaxcore/deepspeech-plugin/) project for more information:

- [https://github.com/jaxcore/deepspeech-plugin/tree/master/examples/web-hotword-example](https://github.com/jaxcore/deepspeech-plugin/tree/master/examples/web-hotword-example)


## Install

Using npm:

```
npm install bumblebee-hotword
```

And include in your web project:

```
import BumbleBee from "bumblebee-hotword";
```

#### Porcupine Web Assembly Codebase

The porcupine webworker files must be manually served from your public html directory and the directory must be specific using `setWorkersPath()` before starting bumblebee.  See the examples for an example.

```
bumblebee.setWorkersPath('/bumblebee-workers');
```

The `bumblebee-workers` directory can be found [here](https://jaxcore.github.io/bumblebee-hotword/bumblebee-workers/)


### Quick Start

```
const BumbleBee = require('bumblebee-hotword');

let bumblebee = new BumbleBee();

// set path to worker files
bumblebee.setWorkersPath('/bumblebee-workers');

// add hotword files
bumblebee.addHotword('bumblebee', require('bumblebee-hotword/hotwords/bumblebee'));
bumblebee.addHotword('grasshopper', require('bumblebee-hotword/hotwords/grasshopper'));
bumblebee.addHotword('hey_edison', require('bumblebee-hotword/hotwords/hey_edison'));
bumblebee.addHotword('porcupine', require('bumblebee-hotword/hotwords/porcupine'));
bumblebee.addHotword('terminator', require('bumblebee-hotword/hotwords/terminator'));

// set sensitivity from 0.0 to 1.0
bumblebee.setSensitivity(0.5);

bumblebee.on('hotword', function(hotword) {
	// YOUR CODE HERE
	console.log('hotword detected:', hotword);
});

bumblebee.start();
```

Note: browsers require user-interaction to start the microphone.

### Hotwords

The hotwords available by default are:

* bumblebee
* grasshopper
* hey edison
* porcupine
* terminator

To have all of the hotwords available at the same time set the hotword to `null` and receive the hotword in the `.on('hotword')` event:

```
bumblebee.setHotword(null);

bumblebee.on('hotword', function(hotword) {
	console.log('hotword detected:', hotword);
});

bumblebee.start();
```

Or to restrict bumblebee to a specific hotword:

```
bumblebee.setHotword('terminator');
```

The [Picovoice hotwords open source hotwords](https://github.com/Picovoice/Porcupine/tree/master/resources/keyword_files) are freely usable under the Apache 2.0 license.  Custom hotwords can be licensed from [https://picovoice.ai](https://picovoice.ai/).

### Sensitivity

Hotword detection sensitivity (0.0 to 1.0) is configurable only before the first call to `bumblebee.start()`

```
bumblebee.setSensitivity(0.8);
```

### Disable BumbleBee

Use the stop() method to disable the microphone and all processing:

```
bumblebee.stop();
```

### Mute and Volume

```
bumblebee.setMuted(true); // mutes microphone volume

bumblebee.setMicVolume(0.5); // sets microphone volume to 50%
```

### Spectrum Analyzer

Bumblebee instantiates an [audio analyser](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createAnalyser) which can be used to draw an oscilloscope or other types of processing:

```
bumblebee.on('analyser', function(analyser) {
	// analyser is an instance of audioContext.createAnalyser()
});
```

### Audio Data

Bumblebee emits a stream of "data" events which can be used to receive the microphone audio data after downsampling to 16bit/16khz PCM.  This is the format also used by other speech processing systems such as DeepSpeech.

```
bumblebee.on('data', function(data) {
	console.log('data', data);
});
```


## Run Examples Locally

Clone this repo, then...

For the [basic](https://jaxcore.github.io/bumblebee-hotword/basic-example/) example:

```
cd examples/basic-example
yarn install
yarn run
```

For the [full](https://jaxcore.github.io/bumblebee-hotword/full-example/) example:

```
cd examples/full-example
yarn install
yarn run
```

For the DeepSpeech speech recognition and hotword example, see instructions:

- [https://github.com/jaxcore/bumblebee-hotword/tree/master/examples/deepspeech-example](https://github.com/jaxcore/bumblebee-hotword/tree/master/examples/deepspeech-example)


## License

This repository is licensed under Apache 2.0.  See [Porcupine](https://github.com/Picovoice/Porcupine) for more details.

## Change Log

**0.0.5:**

- fixed start/stop related bugs
- added separate setLineColor() setBackgroundColor() methods

**0.0.4:**

- added spectrum analyser
- setMuted() and setMicVolume() methods
- DeepSpeech example
