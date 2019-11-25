# BumbleBee Hotword

![screenshot](https://raw.githubusercontent.com/jaxcore/bumblebee-hotword/master/logo.png)

A heavily stripped down, JavaScript-only version of the excellent [Porcupine](https://github.com/Picovoice/Porcupine) wake word (hotword) system. This requires no cloud services and is freely available to use under the Apache 2.0 license (GPLv3 compatible).

When BumbleBee is added to a web page, it listens to the microphone and calls a function when it hears the word "bumblebee":

```
const BumbleBee = require('bumblebee-hotword');

let bumblebee = new BumbleBee();

bumblebee.setHotword('bumblebee');

bumblebee.setSensitivity(0.1);

bumblebee.on('hotword', function(hotword) {
	// YOUR CODE HERE
	console.log('hotword detected:', hotword);
});

bumblebee.start();
```

### Demo

[https://jaxcore.github.io/bumblebee-hotword/](https://jaxcore.github.io/bumblebee-hotword/)


### Hotwords

The hotwords available by default are:

* bumblebee
* caterpillar
* christina
* dragonfly
* francesca
* grasshopper
* porcupine
* terminator

The hotword can be changed at any time:

```
bumblebee.setHotword('dragonfly');
```

To have all of the hotwords available at the same time set the hotword to `null` and receive the hotword in the `.start()` callback:

```
bumblebee.setHotword(null);

bumblebee.on('hotword', function(hotword) {
	console.log('hotword detected:', hotword);
});

bumblebee.start();
```

Note: Depending on the hotword & sensitivity settings these hotwords will sometimes give false positives. However bumblebee, christina, francesca, and grasshopper tend to have the fewest false positives.

These [open source hotwords](https://github.com/Picovoice/Porcupine/tree/master/resources/keyword_files) are freely usable under the Apache 2.0 license.  Custom hotwords can be licensed from [https://picovoice.ai](https://picovoice.ai/).

### Sensitivity

Hotword detection sensitivity (0.0 to 1.0) is configurable only before the first call to `bumblebee.start()`

```
bumblebee.setSensitivity(0.8);
```

### Disable BumbleBee

Use the stop() method:

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

Until a more elegant webpack-based solution can be found, the [pv_porcupine.wasm](lib/pv_porcupine.wasm) file must be manually served relatively from the same directory as the html.  See [example/test/public](https://github.com/jaxcore/bumblebee-hotword/tree/master/examples/test/public)

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

**0.0.2:**

- use ES6 syntax
- converted to EventEmitter, emits "hotword" event
- changed .sensitivity() to .setSensitivity()
- added additional sounds to the example