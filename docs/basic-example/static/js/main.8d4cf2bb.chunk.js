(this["webpackJsonpbumblebee-basic-example"]=this["webpackJsonpbumblebee-basic-example"]||[]).push([[0],{10:function(t,e,o){t.exports=o(27)},15:function(t,e,o){},24:function(t,e){t.exports=function(t,e,o){var n;return{start:function(a,s,r,i,c){(n=new Worker(e)).postMessage({command:"init",keywordIDs:a,sensitivities:s}),n.onmessage=function(t){r(t.data.keyword)},t.start([this],o,i,c)},processFrame:function(t){n.postMessage({command:"process",inputFrame:t})},stop:function(){t.stop(),n.postMessage({command:"release"})}}}},25:function(t,e){var o,n=!1;t.exports={start:function(t,e,a,s){o||navigator.mediaDevices.getUserMedia({audio:!0}).then((function(a){var r=new(window.AudioContext||window.webkitAudioContext),i=r.createMediaStreamSource(a),c=r.createScriptProcessor(4096,1,1);c.onaudioprocess=function(t){n&&o.postMessage({command:"process",inputFrame:t.inputBuffer.getChannelData(0)})},i.connect(c),c.connect(r.destination),(o=new Worker(e)).postMessage({command:"init",inputSampleRate:i.context.sampleRate}),o.onmessage=function(e){t.forEach((function(t){t.processFrame(e.data)})),s&&s(e.data)}})).catch(a),n=!0},stop:function(){n=!1,o.postMessage({command:"reset"})}}},26:function(t,e){t.exports=new Uint8Array([140,20,139,111,75,233,106,137,144,225,192,133,238,96,238,92,238,77,124,58,215,21,175,49,127,74,52,213,106,111,236,227,15,116,168,49,25,247,70,183,184,63,166,55,113,59,20,242,220,165,61,139,6,132,219,145,71,186,73,108,204,114,81,20,173,53,233,81,39,112,154,74,124,38,52,44,103,80,171,64,246,219,196,149,250,86,199,18,85,196,46,148])},27:function(t,e,o){"use strict";o.r(e);var n=o(0),a=o.n(n),s=o(3),r=o.n(s),i=(o(15),o(4)),c=o(5),u=o(8),l=o(6),d=o(9),h=o(7),w=new(o.n(h).a);w.setSensitivity(.5),w.setWorkersPath("./bumblebee-workers"),w.addHotword("bumblebee",o(26)),w.setHotword("bumblebee");var b=function(t){function e(){var t;Object(i.a)(this,e),(t=Object(u.a)(this,Object(l.a)(e).call(this))).state={words:[],started:!1};var o=new Audio("sounds/bumblebee.mp3");return w.on("hotword",(function(e){o.play();var n=t.state.words;n.push(e),t.setState({words:n})})),t}return Object(d.a)(e,t),Object(c.a)(e,[{key:"start",value:function(){this.setState({started:!0}),w.start()}},{key:"stop",value:function(){this.setState({started:!1,words:[]}),w.stop()}},{key:"render",value:function(){var t=this;return a.a.createElement("div",{className:"App"},a.a.createElement("button",{onClick:function(e){t.start()}},"Start"),a.a.createElement("button",{onClick:function(e){t.stop()}},"Stop"),this.renderStarted())}},{key:"renderStarted",value:function(){if(this.state.started)return a.a.createElement("div",null,a.a.createElement("h3",null,'Say "bumblebee":'),a.a.createElement("ul",null,this.state.words.map((function(t,e){return a.a.createElement("li",{key:e},t)}))))}}]),e}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(a.a.createElement(b,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()}))},7:function(t,e,o){var n=o(16),a=o(17),s=o(18),r=o(20),i=o(2),c=o(21),u=o(23),l=o(24),d=o(25),h=function(t){"use strict";function e(){var t;return n(this,e),(t=s(this,r(e).call(this))).hotword=null,t.hotwords={},t.setSensitivity(.5),t.setWorkersPath("/"),t.setVoiceProcessor(d),t._detectionCallback=t.detectionCallback.bind(i(t)),t._errorCallback=t.errorCallback.bind(i(t)),t._audioProcessCallback=t.audioProcessCallback.bind(i(t)),t}return c(e,t),a(e,[{key:"setVoiceProcessor",value:function(t){this.webVoiceProcessor=t}},{key:"addHotword",value:function(t,e,o){this.hotwords[t]={data:e,sensitivity:o||this.defaultSensitivity}}},{key:"setHotword",value:function(t){if(null===t||""===t)this.hotword=null;else{if(!(Object.keys(this.hotwords).indexOf(t)>-1))throw new Error("invalid hotword");this.hotword=t}}},{key:"setSensitivity",value:function(t){this.defaultSensitivity=t}},{key:"stop",value:function(){this.porcupineManager.stop(),this.started=!1}},{key:"setWorkersPath",value:function(t){this.webWorkersPath=t}},{key:"detectionCallback",value:function(t){t&&(console.log("bumblebee keyword",t),null===this.hotword||t===this.hotword?this.emit("hotword",t):console.log("wrong hotword:",t))}},{key:"errorCallback",value:function(t){this.emit("error",t)}},{key:"audioProcessCallback",value:function(t){this.emit("data",t)}},{key:"start",value:function(){if(!this.started){this.started=!0,this.porcupineManager=l(this.webVoiceProcessor,this.webWorkersPath+"/porcupine_worker.js",this.webWorkersPath+"/downsampling_worker.js");var t={},e=[];for(var o in this.hotwords){var n=this.hotwords[o];t[o]=n.data,e.push(n.sensitivity)}this.porcupineManager.start(t,new Float32Array(e),this._detectionCallback,this._errorCallback,this._audioProcessCallback)}}}]),e}(u);t.exports=h}},[[10,1,2]]]);
//# sourceMappingURL=main.8d4cf2bb.chunk.js.map