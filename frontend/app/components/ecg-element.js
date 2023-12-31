import p5 from "p5";

import P5Element from './p5-element.js';

export default class extends P5Element {
  constructor(id, state, emit) {
    super(id, state, emit)
    this.state = state;
  }

  sketch() {
    const s = ( p ) => {
      let data = [];
      let d = 0;
      this.state.socket.on("osc", (e) => {
        if (e.address == "/openbci/time-series-filtered/ch0") {
          data.push(...e.args.map(e => ({diff: undefined, v: e.value })));

          const N = 1000;
          if (data.length > N) {
            data.splice(0, data.length - N);
          }
          // document.querySelector('#counter').innerText = e.args[0].value//JSON.stringify(e)
        }
      });
      
      p.preload = () => {
      };

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      };

      p.draw = () => {
        window.pulse = d = p.constrain(d - 0.02, 0, 1);
        p.clear();
        // p.background(p.lerpColor(p.color(255, 0, 0), p.color(0, 255, 0), d));
        // p.text(data, 10, 10);

        for (let i = 0; i < data.length; i++) {
          if (data[i].diff == undefined) {
            if (i == 0) {
              data[i].diff = 0;
            }
            else {
              data[i].diff = data[i - 1].v - data[i].v;
            }
            if (Math.abs(data[i].diff) > 100) {
              d = 1;
            }
          }
        }

        p.stroke("white");
        p.noFill();
        p.beginShape();
        for (let i = 0; i < data.length; i++) {
          let x = p.map(i, 0, data.length, 0, p.width);
          p.vertex(x, data[i].v * 0.1 + p.height / 2);
        }
        p.endShape();
      };
      
      p.windowResized = () => {
        p.resizeCanvas(p.parentElement.clientWidth, p.parentElement.clientHeight);
      }
    };

    return new p5(s);
  }
}
