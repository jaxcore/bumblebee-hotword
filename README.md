# BumbleBee Hotword

![screenshot](https://raw.githubusercontent.com/jaxcore/bumblebee-hotword/master/logo.png)

This is a stripped down and repackaged version of the excellent [Porcupine](https://github.com/Picovoice/Porcupine) wake word (hotword) system. This requires no cloud services and is freely available to use under the Apache 2.0 license (GPLv3 compatible).

When BumbleBee is added to a web page (or ElectronJS), it listens to the microphone and emits an event when it hears the available hotwords.

If you need hotword detection in NodeJS see the [NodeJS version of BumbleBee](https://github.com/jaxcore/bumblebee-hotword-node).

## Examples

- [Basic Example](https://jaxcore.github.io/bumblebee-hotword/basic-example/) - most simple example possible
- [Full Example](https://jaxcore.github.io/bumblebee-hotword/full-example/) - all options available, with visualization

#### DeepSpeech Examples:

Bumblebee can be used as a hotword/keyword system for [Mozilla DeepSpeech](https://github.com/dsteinman/DeepSpeech) speech recognition engine.  See the [Jaxcore DeepSpeech Plugin](https://github.com/jaxcore/deepspeech-plugin/) project for more information:

- [Web-based client-serer example](https://github.com/jaxcore/deepspeech-plugin/tree/master/examples/web-hotword-example) - uses a ReactJS client streaming to a NodeJS server running DeepSpeech
- [ElectronJS example](https://github.com/jaxcore/deepspeech-plugin/tree/master/examples/electron-example) - runs DeepSpeech and BumbleBee inside an Electron desktop application


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

The `bumblebee-workers` directory can be found [here](https://github.com/jaxcore/bumblebee-hotword/tree/master/bumblebee-workers)


### Quick Start

```
const BumbleBee = require('bumblebee-hotword');

let bumblebee = new BumbleBee();

// set path to worker files
bumblebee.setWorkersPath('/bumblebee-workers');

// add hotword
bumblebee.addHotword('bumblebee');

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

Due to processing time it is recommended to only add the hotwords that need to be used.  The hotword spoken can be retreived in the `.on('hotword')` event:

```
bumblebee.addHotword('bumblebee');
bumblebee.addHotword('grasshopper');
bumblebee.addHotword('hey_edison');
bumblebee.addHotword('porcupine');
bumblebee.addHotword('terminator');

bumblebee.on('hotword', function(hotword) {
	console.log('hotword detected:', hotword);
});
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

### Mute

```
bumblebee.setMuted(true); // mutes microphone volume
```

### Set Microphone Volume

```
bumblebee.setMicVolume(0.5); // sets microphone volume to 50%
```

```
bumblebee.setMicVolume(2); // sets microphone volume to 200%
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

For the DeepSpeech speech recognition and hotword example, see instructions at:

- [https://github.com/jaxcore/deepspeech-plugin](https://github.com/jaxcore/deepspeech-plugin)

## License

This repository is licensed under Apache 2.0.  See [Porcupine](https://github.com/Picovoice/Porcupine) for more details.

## Change Log

**0.0.6:**

- add the default hotwords back in to simplify the syntax to .addHotword('bumblebee')

**0.0.5:**

- fixed start/stop related bugs
- added separate setLineColor() setBackgroundColor() methods

**0.0.4:**

- added spectrum analyser
- setMuted() and setMicVolume() methods
- DeepSpeech example
