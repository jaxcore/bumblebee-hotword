![screenshot](logo.png)

# Bumblebee Hotword

Bumblebee Hotword is a stripped down and repackaged version of the excellent [Porcupine](https://github.com/Picovoice/Porcupine) wake word (hotword) system. This requires no cloud services and is freely available to use under the Apache 2.0 license (GPLv3 compatible).

When Bumblebee Hotword is added to a web page, it listens to the microphone and emits an event when it hears any of the available hotwords.

For more information about the Bumblebee platform and its other features visit:

- [https://github.com/jaxcore/bumblebee](https://github.com/jaxcore/bumblebee)

## NodeJS Version

If you need hotword detection in NodeJS use [bumblebee-hotword-node](https://github.com/jaxcore/bumblebee-hotword-node).

## Examples

- [Basic Example](https://jaxcore.github.io/bumblebee-hotword/basic-example/) - most simple example possible
- [Full Example](https://jaxcore.github.io/bumblebee-hotword/full-example/) - all options available, with visualization

## Install

Using npm:

```
npm install bumblebee-hotword
```

And include in your web project:

```
import Bumblebee from "bumblebee-hotword";
```

#### Porcupine Web Assembly Codebase

The porcupine webworker files must be manually served from your public html directory and the location must be specified using `setWorkersPath()` before starting bumblebee.

```
bumblebee.setWorkersPath('/bumblebee-workers');
```

Copy the entire directory [here](https://github.com/jaxcore/bumblebee-hotword/tree/master/bumblebee-workers) to your web server's public html or assets directory.


### Quick Start

```
const Bumblebee = require('bumblebee-hotword');

let bumblebee = new Bumblebee();

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

* alexa
* bumblebee
* computer
* grasshopper
* hey edison
* hey google
* hey siri
* jarvis
* ok google
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

### Adding a Custom Hotword

Like the open source hotwords, the file must be in Porcupine's "_wasm.ppn" format.

You can use the [tools/convert_ppn.sh](tools/convert_ppn.sh) shell script (uses the xdd command line program) to convert the PPN file to a JavaScript file:

```
sh tools/convert_ppn.sh my_custom_hotword_wasm.ppn
```

The resulting .js file can then be added to Bumblebee:

```
import my_custom_hotword from './my_custom_hotword'
bumblebee.addHotword('my_custom_hotword', my_custom_hotword, 0.5)
```


### Sensitivity

Hotword detection sensitivity (0.0 to 1.0) is configurable only before the first call to `bumblebee.start()`

```
bumblebee.setSensitivity(0.8);
```

### Disable Bumblebee

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

Bumblebee Hotword instantiates an [audio analyser](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createAnalyser) which can be used to draw an oscilloscope or other types of processing:

```
bumblebee.on('analyser', function(analyser) {
	// analyser is an instance of audioContext.createAnalyser()
});
```

### Audio Data

Bumblebee Hotword emits a stream of "data" events which can be used to receive the microphone audio data after downsampling to 16bit/16khz PCM.  This is the format also used by other speech processing systems such as DeepSpeech.

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
yarn start
```

For the [full](https://jaxcore.github.io/bumblebee-hotword/full-example/) example:

```
cd examples/full-example
yarn install
yarn start
```

## License

This repository is licensed under Apache 2.0.  See [Porcupine](https://github.com/Picovoice/Porcupine) for more details.

## Change Log

**0.2.1:**

- add "ok google" hotword

**0.2.0:**

- upgrade to Porcupine v1.9
- added new Porcupine hotwords: computer, alexa, hey google, hey siri, jarvis

**0.1.0:**

- add microphone selection
