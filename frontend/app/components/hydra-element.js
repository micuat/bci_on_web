import html from 'choo/html'
import Component from 'choo/component'

import Hydra from 'hydra-synth';

export default class HydraCanvas extends Component {
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


    const hydraOptions = { detectAudio: true, canvas: element.querySelector("canvas"), precision: precisionValue }
    
    this.hydra = new Hydra(hydraOptions)
    if (this.code) {
      this.hydra.eval(this.code);
    }
    window.hydraSynth = this.hydra
    //  if(environment !== 'local') {
    // }
    this.emit('hydra loaded')
  }

  update({ code }) {
    this.hydra.eval(code);
    return false
  }

  createElement({ width = window.innerWidth, height = window.innerHeight, code } = {}) {
    this.code = code;
    return html`<div style="width:100%;height:100%;">
        <canvas id="hydra-canvas" class="bg-black" style="image-rendering:pixelated; width:100%;height:100%" width="${width}" height="${height}"></canvas></div>`
  }
}
