# Bumblebee / DeepSpeech Example

This is an example of using [Bumblebee-Hotword](https://github.com/jaxcore/bumblebee-hotword) as the hotword/keyword system to activate browser-based speech recognition using [DeepSpeech](https://github.com/mozilla/DeepSpeech) running in a NodeJS server.

#### Download the DeepSpeech pre-trained model (1.8GB):

```
wget https://github.com/mozilla/DeepSpeech/releases/download/v0.6.0/deepspeech-0.6.0-models.tar.gz
tar xvfz deepspeech-0.6.0-models.tar.gz
```

#### Install:

```
yarn install
```

#### Run ReactJS Client:

```
yarn start
```

#### Run NodeJS Server (in a separate terminal window):

```
node server.js
```