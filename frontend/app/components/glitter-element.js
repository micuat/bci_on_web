import html from 'choo/html';
import Component from 'choo/component';

import Hydra from 'hydra-synth';
import bitcrusher from '../bitcrusher.js';

//https://github.com/mattdiamond/synthjs/blob/master/synth.js
function FeedbackDelayNode(context, delay, feedback){
  this.delayTime.value = delay;
  this.gainNode = context.createGain();
  this.gainNode.gain.value = feedback;
  this.connect(this.gainNode);
  this.gainNode.connect(this);
}

function FeedbackDelayFactory(context, delayTime, feedback){
  var delay = context.createDelay(delayTime);
  FeedbackDelayNode.call(delay, context, delayTime, feedback);
  return delay;
}


let audioContext;

let active = false;

//create an array to hold our cc values and init to a normalized value
var cc = Array(128).fill(0);

document.onclick = function(event) {
  // for legacy browsers
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContext();
  if (active === false) {
    active = true;

    sine(()=>cc[16]*20).modulate(sine(()=>cc[17]*2), ()=>cc[18]*10)
      .crush(()=>Math.floor(cc[19]/16))
    .feedback(()=>cc[20]/127, ()=>cc[21]/127*0.8).out()
  }
}

var mouseX = 0,
  mouseY = 0,
  time = 0,
  speed = 2;

// document.onmousemove = function(event) {
//   var eventDoc, doc, body;

//   event = event || window.event; // IE-ism

//   // If pageX/Y aren't available and clientX/Y are,
//   // calculate pageX/Y - logic taken from jQuery.
//   // (This is to support old IE)
//   if (event.pageX == null && event.clientX != null) {
//     eventDoc = (event.target && event.target.ownerDocument) || document;
//     doc = eventDoc.documentElement;
//     body = eventDoc.body;

//     event.pageX =
//       event.clientX +
//       ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
//       ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
//     event.pageY =
//       event.clientY +
//       ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
//       ((doc && doc.clientTop) || (body && body.clientTop) || 0);
//   }

//   mouseX = Math.max(0, Math.min(100000, event.pageX));
//   mouseY = Math.max(0, Math.min(100000, event.pageY));
//   // Use event.pageX / event.pageY here
// };

const updaters = [];
const updater = () => {
  time += 10 / 1000;
  for (const u of updaters) {
    u();
  }
  setTimeout(updater, 10);
};
updater();

function addValue(obj, func, val) {
  if (typeof val === "function") {
    if (typeof obj[func] === "function") {
      updaters.push(() => {
        obj[func](val());
      });
    } else {
      updaters.push(() => {
        obj[func] = val();
      });
    }
  } else if (Array.isArray(val)) {
    if (typeof obj[func] === "function") {
      updaters.push(() => {
        obj[func](val[Math.floor((time * speed) % val.length)]);
      });
    } else {
      updaters.push(() => {
        obj[func] = val[Math.floor((time * speed) % val.length)];
      });
    }
  } else {
    if (typeof obj[func] === "function") {
    } else {
      obj[func] = val;
    }
  }
}

const synths = [];

class Synthesizer {
  constructor({ toneSynth, objSynth }) {
    if (toneSynth !== undefined) {
      this.source = toneSynth;
      this.outlet = toneSynth;
    } else {
      // ???????
      this.outlet = objSynth.outlet;
      this.source = objSynth.source;
      this.play = objSynth.play;
    }
    this.queue = [];
  }
  out(index = 0) {
    this.outlet.connect(audioContext.destination);
    this.queue.push(this.source);
    if (synths[index] != null || synths[index] != undefined) {
      for (const s of synths[index]) {
        s.stop();
      }
    }
    synths[index] = this.queue;
    this.play();
  }
  gain(v) {
    const g = audioContext.createGain();
    this.outlet.connect(g);
    addValue(g.gain, "value", v);
    this.outlet = g;
    return this;
  }
  feedback(delayTime, amount) {
    const effect = FeedbackDelayFactory(audioContext, 0.1, 1);
    this.outlet.connect(effect);
    this.outlet = effect;
    addValue(effect.delayTime, "value", delayTime);
    addValue(effect.gainNode.gain, "value", amount);
    return this;
  }
  crush(bits) {
    const effect = bitcrusher(audioContext, {
      bitDepth: 32,
      frequency: 1
    });
    this.outlet.connect(effect);
    this.outlet = effect;
    addValue(effect, "bitDepth", bits);
    return this;
  }
  mult(s) {
    this.queue.push(s.outlet);
    const g = audioContext.createGain();
    this.outlet.connect(g.gain);
    s.outlet.connect(g);
    this.outlet = g;
    return this;
  }
  modulate(s, v = 100) {
    this.queue.push(s.outlet);
    this.modulator = s;

    const g = audioContext.createGain();
    s.outlet.connect(g);
    addValue(g.gain, "value", v);
    g.connect(this.source.detune);

    return this;
  }
  play() {
    for (const s of this.queue) {
      s.start();
    }
  }
}

class WaveSynthesizer extends Synthesizer {
  constructor({ toneSynth: s }) {
    super({ toneSynth: s });
  }
}

class Sine extends WaveSynthesizer {
  constructor(f, type = "sine") {
    const s = audioContext.createOscillator();

    s.type = type;
    super({ toneSynth: s });
    this.freq = f;
    addValue(s.frequency, "value", f);
  }
}

const sine = freq => {
  return new Sine(freq);
};

const tri = freq => {
  return new Sine(freq, "triangle");
};

const square = freq => {
  return new Sine(freq, "square");
};


export default class GlitterComponent extends Component {
  constructor(id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
    state.hydra = this // hacky
    this.state = state
    this.emit = emit
  }

  load(element) {
    let isIOS =
      (/iPad|iPhone|iPod/.test(navigator.platform) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
      !window.MSStream;
    let precisionValue = isIOS ? 'highp' : 'mediump'

    const hydraOptions = {
      detectAudio: false,
      canvas: element.querySelector("canvas"),
      precision: precisionValue
    };
    
    this.hydra = new Hydra(hydraOptions)
    if (this.code) {
      this.hydra.eval(this.code);
    }
    window.hydraSynth = this.hydra
    //  if(environment !== 'local') {
    // }
    this.emit('hydra loaded');

    for (let i = 0; i < 6; i++) {
      const s = element.querySelector('#slide' + i);
      cc[i+16] = s.value;
      s.oninput = function () {
        cc[i+16] = this.value;
      }
    }

    // let midiLoaded;

    src(o0).modulate(src(o0).brightness(-0.5), ()=>(1-cc[20]/127)*0.1)
      .layer(
      osc(6,0,1.5).modulate(
      noise(()=>Number(cc[16])).sub(gradient()),1)
        .modulate(osc().kaleid(999),()=>cc[17]/127)
        .modulate(gradient().r().pixelate(4).repeat(4).color(0,1),()=>(1-Math.min(1, 2*cc[19]/127)))
        .modulate(osc(3).kaleid(999),()=>cc[18]/127)
        .mask(shape(4,()=>1-cc[21]/127,0))
      )
      .out()


    // // finally load midi

    // // register WebMIDI
    // if(navigator.requestMIDIAccess === undefined) {
    //   midiLoaded = false;
    //   onMIDIFailure();
    // }
    // else {
    //   navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    // }

    // function onMIDISuccess(midiAccess) {
    //   console.log(midiAccess);
    //   var inputs = midiAccess.inputs;
    //   var outputs = midiAccess.outputs;
    //   for (var input of midiAccess.inputs.values()) {
    //     input.onmidimessage = getMIDIMessage;
    //   }
    //   if (inputs.length > 0) {
    //     midiLoaded = true;
    //   }
    //   else {
    //     midiLoaded = false;
    //   }
    // }

    // function onMIDIFailure() {
    //   console.log("Could not access your MIDI devices.");
    //   midiLoaded = false;
    // }

    // let getMIDIMessage = function(midiMessage) {
    //   var arr = midiMessage.data;
    //   var index = arr[1];
    //   console.log("Midi received on cc#" + index + " value:" + arr[2]); // uncomment to monitor incoming Midi
    //   var val = (arr[2]) / 127.0; // normalize CC values to 0.0 - 1.0
    //   cc[index] = val;
    // };
  }

  update({ code }) {
    this.hydra.eval(code);
    return false
  }

  createElement({ width = window.innerWidth, height = window.innerHeight, code } = {}) {
    this.code = code;
    return html`
    <div style="width:100%;height:100%;">
      <canvas id="hydra-canvas" class="bg-black" style="image-rendering:pixelated; width:100%;height:100%" width="${width}" height="${height}"></canvas>
      <div class="slidecontainer">
        <input type="range" min="0" max="127" value="0" class="slider" id="slide0">
        <input type="range" min="0" max="127" value="3" class="slider" id="slide1">
        <input type="range" min="0" max="127" value="0" class="slider" id="slide2">
        <input type="range" min="0" max="127" value="127" class="slider" id="slide3">
        <input type="range" min="0" max="127" value="0" class="slider" id="slide4">
        <input type="range" min="0" max="127" value="0" class="slider" id="slide5">
      </div>
    </div>`
  }
}
