# BumbleBee Hotword

![screenshot](https://raw.githubusercontent.com/jaxcore/bumblebee-hotword/master/logo.png)

This is a stripped down and repackaged version of the excellent [Porcupine](https://github.com/Picovoice/Porcupine) wake word (hotword) system. This requires no cloud services and is freely available to use under the Apache 2.0 license (GPLv3 compatible).

When BumbleBee is added to a web page, it listens to the microphone and calls a function when it hears the available hotwords:

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

### Demo

Basic Example: [https://jaxcore.github.io/bumblebee-hotword/basic-example/](https://jaxcore.github.io/bumblebee-hotword/basic-example/)

Full Example: [https://jaxcore.github.io/bumblebee-hotword/full-example/](https://jaxcore.github.io/bumblebee-hotword/full-example/)

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


### Run Demo Locally

Clone this repo, then:

```
cd examples/test
npm install
npm run
```

### License

This repository is licensed under Apache 2.0.  See [Porcupine](https://github.com/Picovoice/Porcupine) for more details.

### Change Log

**0.0.3:**

- upgrade to Porcupine Manager 1.3.0
- list of Porcupine hotwords has been reduced but accuracy has increased
- addHotword() syntax and worker files has changed
- bumblebee.on('data') emits downsampled 16khz audio data

**0.0.2:**

- use ES6 syntax
- converted to EventEmitter, emits "hotword" event
- changed .sensitivity() to .setSensitivity()
- created a simple "basic" example
- added Text-to-Speech (jaxcore-say) to the full-example
- added additional sounds to the full-example